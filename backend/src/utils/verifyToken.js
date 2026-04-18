const jwt = require('jsonwebtoken')
 
const verifyToken = (req) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw { status: 401, message: 'Token manquant' }
  }
  const token = authHeader.split(' ')[1]
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    throw { status: 401, message: 'Token invalide ou expiré' }
  }
}
 
module.exports = verifyToken