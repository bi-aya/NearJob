const jobService = require('../services/job.service')
const { validateCreateJobDto } = require('../dto/job.dto.js')

// ─── POST /api/jobs ───────────────────────────────────────────────────
const createJob = async (req, res, next) => {
  try {

    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Accès réservé aux recruteurs.' })
    }

    // Validation DTO
    const errors = validateCreateJobDto(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ errors })
    }

    const job = await jobService.createJob(req.body, req.user.id)
    res.status(201).json(job)

  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message })
    }
    next(err)
  }
}

// ─── GET /api/jobs ────────────────────────────────────────────────────
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.getAllJobs()
    res.status(200).json(jobs)
  } catch (err) {
    next(err)
  }
}

// ─── GET /api/jobs/my ─────────────────────────────────────────────────
const getMyJobs = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter')
      return res.status(403).json({ message: 'Accès réservé aux recruteurs.' })

    const jobs = await jobService.getMyJobs(req.user.id)
    res.status(200).json(jobs)
  } catch (err) {
    next(err)
  }
}

// ─── GET /api/jobs/:id ────────────────────────────────────────────────
const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id)
    res.status(200).json(job)
  } catch (err) {
    next(err)
  }
}

// ─── DELETE /api/jobs/:id ─────────────────────────────────────────────
const deleteJob = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter')
      return res.status(403).json({ message: 'Accès réservé aux recruteurs.' })

    const result = await jobService.deleteJob(req.params.id, req.user.id)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = { createJob, getAllJobs, getMyJobs, getJobById, deleteJob }