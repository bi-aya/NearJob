const bcrypt            = require('bcryptjs')
const jwt               = require('jsonwebtoken')
const { AppDataSource } = require('../data-source')
 
const userRepo = () => AppDataSource.getRepository('User')
 
const signAccessToken  = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' })
 
const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
 
// ─── Register ─────────────────────────────────────────────────────────
const register = async ({ email, password, role = 'freelance', firstName, lastName }) => {
  const repo = userRepo()
 
  const existing = await repo.findOne({ where: { email } })
  if (existing) throw { status: 409, message: 'Cet email est déjà utilisé' }
 
  const passwordHash = await bcrypt.hash(password, 12)
  const user = repo.create({ email, passwordHash, role, firstName, lastName })
  await repo.save(user)
 
  const payload      = { id: user.id, email: user.email, role: user.role }
  const accessToken  = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)
 
  const { passwordHash: _, ...safeUser } = user
  return { user: safeUser, accessToken, refreshToken }
}
 
// ─── Login ────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  const repo = userRepo()
 
  const user = await repo.findOne({ where: { email } })
  if (!user) throw { status: 401, message: 'Email ou mot de passe incorrect' }
 
  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) throw { status: 401, message: 'Email ou mot de passe incorrect' }
 
  const payload      = { id: user.id, email: user.email, role: user.role }
  const accessToken  = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)
 
  const { passwordHash: _, ...safeUser } = user
  return { user: safeUser, accessToken, refreshToken }
}
 
// ─── Refresh ──────────────────────────────────────────────────────────
const refreshTokens = (refreshToken) => {
  try {
    const decoded      = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const payload      = { id: decoded.id, email: decoded.email, role: decoded.role }
    const accessToken  = signAccessToken(payload)
    const newRefresh   = signRefreshToken(payload)
    return { accessToken, refreshToken: newRefresh }
  } catch {
    throw { status: 401, message: 'Refresh token invalide ou expiré' }
  }
}
 
// ─── Get me ───────────────────────────────────────────────────────────
const getMe = async (userId) => {
  const repo = userRepo()
  const user = await repo.findOne({ where: { id: userId } })
  if (!user) throw { status: 404, message: 'Utilisateur introuvable' }
  const { passwordHash: _, ...safeUser } = user
  return safeUser
}
 
module.exports = { register, login, refreshTokens, getMe }