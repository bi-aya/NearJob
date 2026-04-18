const express    = require('express')
const router     = express.Router()
const svc        = require('../services/application.service')
const verifyToken = require('../utils/verifyToken')

const auth = (req, res, next) => {
  try {
    req.user = verifyToken(req)
    next()
  } catch (err) {
    res.status(err.status || 401).json({ message: err.message })
  }
}

// ─────────────────────────────────────────────────────────────────────
// FREELANCE
// ─────────────────────────────────────────────────────────────────────

// POST /api/applications — postuler à une offre
// Body : { jobId, message? }
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'freelance')
      return res.status(403).json({ message: 'Seuls les freelances peuvent postuler.' })

    const { jobId, message } = req.body
    if (!jobId)
      return res.status(400).json({ message: 'jobId requis' })

    const application = await svc.apply(req.user.id, jobId, message)
    res.status(201).json(application)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

// GET /api/applications/me — mes candidatures (freelance)
router.get('/me', auth, async (req, res) => {
  try {
    const apps = await svc.getMyApplications(req.user.id)
    res.status(200).json(apps)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

// DELETE /api/applications/:id — retirer une candidature (freelance)
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await svc.withdraw(req.params.id, req.user.id)
    res.status(200).json(result)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

// ─────────────────────────────────────────────────────────────────────
// RECRUTEUR
// ─────────────────────────────────────────────────────────────────────

// GET /api/applications/received — toutes les candidatures reçues
router.get('/received', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter')
      return res.status(403).json({ message: 'Réservé aux recruteurs.' })

    const apps = await svc.getAllApplicationsForRecruiter(req.user.id)
    res.status(200).json(apps)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

// GET /api/applications/job/:jobId — candidatures d'un job précis
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter')
      return res.status(403).json({ message: 'Réservé aux recruteurs.' })

    const apps = await svc.getApplicationsForJob(req.params.jobId, req.user.id)
    res.status(200).json(apps)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

// PATCH /api/applications/:id/status — changer le statut
// Body : { status: 'viewed' | 'accepted' | 'rejected' }
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter')
      return res.status(403).json({ message: 'Réservé aux recruteurs.' })

    const { status } = req.body
    if (!status)
      return res.status(400).json({ message: 'status requis' })

    const updated = await svc.updateStatus(req.params.id, req.user.id, status)
    res.status(200).json(updated)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
})

module.exports = router