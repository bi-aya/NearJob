const { AppDataSource } = require('../data-source')
const { sendPushToAllUsers } = require('./push.service')
const JobSchema = require('../entities/Job')

const jobRepo = () => AppDataSource.getRepository(JobSchema)


// ─────────────────────────────────────────────
// 🟢 CREATE JOB
// ─────────────────────────────────────────────
const createJob = async (jobData, userId) => {
  const repo = jobRepo()

  const newJob = repo.create({
    ...jobData,
    recruiter: { id: userId },
  })

  const savedJob = await repo.save(newJob)

  // 🚀 Envoi push NON BLOQUANT
  sendPushToAllUsers(
    'Nouveau job disponible !',
    `${savedJob.title} — ${savedJob.location || ''}`,
    {
      screen: 'JobDetail',
      jobId: savedJob.id,
    }
  )

  return savedJob
}


// ─────────────────────────────────────────────
// 📄 GET ALL JOBS
// ─────────────────────────────────────────────
const getAllJobs = async () => {
  const repo = jobRepo()

  return repo.find({
    order: { createdAt: 'DESC' },
  })
}


// ─────────────────────────────────────────────
// 👤 GET MY JOBS
// ─────────────────────────────────────────────
const getMyJobs = async (recruiterId) => {
  const repo = jobRepo()

  return repo.find({
    where: { recruiter: { id: recruiterId } },
    order: { createdAt: 'DESC' },
  })
}


// ─────────────────────────────────────────────
// 🔍 GET JOB BY ID
// ─────────────────────────────────────────────
const getJobById = async (id) => {
  const repo = jobRepo()

  const job = await repo.findOne({
    where: { id },
    relations: ['recruiter'], // optionnel mais utile
  })

  if (!job) {
    throw { status: 404, message: 'Job introuvable' }
  }

  return job
}


// ─────────────────────────────────────────────
// 🗑 DELETE JOB
// ─────────────────────────────────────────────
const deleteJob = async (id, recruiterId) => {
  const repo = jobRepo()

  const job = await repo.findOne({
    where: { id },
    relations: ['recruiter'],
  })

  if (!job) {
    throw { status: 404, message: 'Job introuvable' }
  }

  if (job.recruiter?.id !== recruiterId) {
    throw { status: 403, message: 'Action non autorisée' }
  }

  await repo.remove(job)

  return { message: 'Job supprimé avec succès' }
}


module.exports = {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  deleteJob,
}