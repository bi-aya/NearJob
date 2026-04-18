const express      = require('express')
const router       = express.Router()
const authService  = require('../services/auth.service')

const validateDto  = require('../middlewares/validate.middleware')
const { RegisterDto, LoginDto } = require('../dto/auth.dto')
 
// POST /api/auth/register
// Le middleware intercepte la requête, valide, et passe à la suite si c'est bon
router.post('/register', validateDto(RegisterDto), async (req, res) => {
  try {
    const data = await authService.register(req.body)
    res.status(201).json(data)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})
 
// POST /api/auth/login
router.post('/login', validateDto(LoginDto), async (req, res) => {
  try {
    const data = await authService.login(req.body)
    res.status(200).json(data)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})
 
// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token requis' })
 
    const tokens = await authService.refreshTokens(refreshToken)
    res.status(200).json(tokens)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

module.exports = router