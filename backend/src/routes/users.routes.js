const express      = require('express')
const router       = express.Router()
const usersService = require('../services/users.service')
const verifyToken  = require('../utils/verifyToken')
const {
  validateUpdateProfileDto,
  validateSkillsDto,
  validateExperienceDto,
} = require('../dto/users.dto')

// GET /api/users/me — profil complet
router.get('/me', async (req, res) => {
  try {
    const decoded = verifyToken(req)
    const profile = await usersService.getProfile(decoded.id)
    res.status(200).json(profile)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

// PUT /api/users/me — mettre à jour le profil
router.put('/me', async (req, res) => {
  try {
    const decoded = verifyToken(req)
    const errors  = validateUpdateProfileDto(req.body)
    if (errors.length > 0)
      return res.status(400).json({ message: errors[0], errors })

    const user = await usersService.updateProfile(decoded.id, req.body)
    res.status(200).json(user)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

// PATCH /api/users/me/availability — toggle disponibilité
router.patch('/me/availability', async (req, res) => {
  try {
    const decoded = verifyToken(req)
    const result  = await usersService.toggleAvailability(decoded.id)
    res.status(200).json(result)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

// PATCH /api/users/me/location — mettre à jour la position GPS
router.patch('/me/location', async (req, res) => {
  try {
    const decoded = verifyToken(req)
    const { latitude, longitude } = req.body
    if (latitude === undefined || longitude === undefined)
      return res.status(400).json({ message: 'latitude et longitude requis' })

    const result = await usersService.updateLocation(decoded.id, { latitude, longitude })
    res.status(200).json(result)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

// PUT /api/users/me/skills — mettre à jour les skills
router.put('/me/skills', async (req, res) => {
  try {

    const decoded = verifyToken(req)
   
    
     console.log("Body reçu:", req.body);
    const user = await usersService.updateCompetences(decoded.id, req.body.competenceIds)

    res.status(200).json(user)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

// POST /api/users/me/experiences — ajouter une expérience
router.post('/me/experiences', async (req, res) => {
  try {
    const decoded = verifyToken(req)
    const errors  = validateExperienceDto(req.body)
    if (errors.length > 0)
      return res.status(400).json({ message: errors[0], errors })

    const xp = await usersService.addExperience(decoded.id, req.body)
    res.status(201).json(xp)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

// DELETE /api/users/me/experiences/:id — supprimer une expérience
router.delete('/me/experiences/:id', async (req, res) => {
  try {
    const decoded = verifyToken(req)
    const result  = await usersService.deleteExperience(decoded.id, req.params.id)
    res.status(200).json(result)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

// PATCH /api/users/me/push-token — enregistrer token push
router.patch('/me/push-token', async (req, res) => {
  try {
    const decoded = verifyToken(req)
    const { pushToken } = req.body
    if (!pushToken)
      return res.status(400).json({ message: 'pushToken requis' })

    const result = await usersService.updatePushToken(decoded.id, pushToken)
    res.status(200).json(result)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})



module.exports = router
