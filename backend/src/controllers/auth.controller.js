const authService = require('../services/auth.service')
 
const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' })
    }
    const data = await authService.register({ email, password, role })
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
}
 
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' })
    }
    const data = await authService.login({ email, password })
    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}
 
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token requis' })
    }
    const tokens = authService.refreshTokens(refreshToken)
    res.status(200).json(tokens)
  } catch (err) {
    next(err)
  }
}
 
const getMe = async (req, res, next) => {
  try {
    // req.user est injecté par jwtMiddleware
    const user = await authService.getMe(req.user.id)
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}
 
module.exports = { register, login, refresh, getMe }