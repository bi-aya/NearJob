const express       = require('express')
const router        = express.Router()
const jobController = require('../controllers/job.controller')
const verifyToken   = require('../utils/verifyToken')

// ─── Middleware auth réutilisable ─────────────────────────────────────
const authenticate = (req, res, next) => {
  try {
    req.user = verifyToken(req) 
    next()
  } catch (err) {
    res.status(err.status || 401).json({ message: err.message })
  }
}

router.get('/my',         authenticate, jobController.getMyJobs)
// ─── Routes protégées (JWT requis) ────────────────────────────────────
router.post('/',          authenticate, jobController.createJob)
router.delete('/:id',     authenticate, jobController.deleteJob)

// ─── Routes publiques ─────────────────────────────────────────────────
router.get('/',      jobController.getAllJobs)
router.get('/:id',   jobController.getJobById) 

module.exports = router