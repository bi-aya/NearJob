const { AppDataSource } = require('../data-source')

const appRepo = () => AppDataSource.getRepository('Application')
const jobRepo = () => AppDataSource.getRepository('Job')

// ─── Postuler à une offre ─────────────────────────────────────────────
const apply = async (applicantId, jobId, message) => {
  const repo = appRepo()

  // Vérifier que le job existe
  const job = await jobRepo().findOne({ where: { id: jobId } })
  if (!job) throw { status: 404, message: 'Offre introuvable' }

  // Empêcher de postuler deux fois
  const existing = await repo.findOne({
    where: {
      applicant: { id: applicantId },
      job:       { id: jobId },
    },
  })
  if (existing) throw { status: 409, message: 'Vous avez déjà postulé à cette offre' }

  // Empêcher le recruteur de postuler à sa propre offre
  if (job.recruiter?.id === applicantId)
    throw { status: 403, message: 'Vous ne pouvez pas postuler à votre propre offre' }

  const application = repo.create({
    message: message || null,
    applicant: { id: applicantId },
    job:       { id: jobId },
  })

  return await repo.save(application)
}

// ─── Mes candidatures (freelance) ─────────────────────────────────────
const getMyApplications = async (applicantId) => {
  return appRepo().find({
    where: { applicant: { id: applicantId } },
    order: { createdAt: 'DESC' },
  })
}

// ─── Candidatures reçues pour un job (recruteur) ──────────────────────
const getApplicationsForJob = async (jobId, recruiterId) => {
  // Vérifier que le recruteur est bien le propriétaire du job
  const job = await jobRepo().findOne({ where: { id: jobId } })
  if (!job) throw { status: 404, message: 'Offre introuvable' }
  if (job.recruiter?.id !== recruiterId)
    throw { status: 403, message: 'Accès non autorisé' }

  return appRepo().find({
    where: { job: { id: jobId } },
    order: { createdAt: 'DESC' },
  })
}

// ─── Toutes les candidatures reçues (recruteur) ───────────────────────
const getAllApplicationsForRecruiter = async (recruiterId) => {
  return appRepo()
    .createQueryBuilder('app')
    .leftJoinAndSelect('app.applicant', 'applicant')
    .leftJoinAndSelect('app.job', 'job')
    .leftJoin('job.recruiter', 'recruiter')
    .where('recruiter.id = :recruiterId', { recruiterId })
    .orderBy('app.createdAt', 'DESC')
    .getMany()
}

// ─── Changer le statut d'une candidature (recruteur) ──────────────────
const updateStatus = async (applicationId, recruiterId, status) => {
  const repo = appRepo()
  const app  = await repo.findOne({ where: { id: applicationId } })
  if (!app) throw { status: 404, message: 'Candidature introuvable' }

  // Vérifier que le recruteur possède le job lié
  const job = await jobRepo().findOne({ where: { id: app.job?.id } })
  if (!job || job.recruiter?.id !== recruiterId)
    throw { status: 403, message: 'Accès non autorisé' }

  const allowed = ['pending', 'viewed', 'accepted', 'rejected']
  if (!allowed.includes(status))
    throw { status: 400, message: `Statut invalide. Valeurs : ${allowed.join(', ')}` }

  app.status = status
  return await repo.save(app)
}

// ─── Retirer sa candidature (freelance) ───────────────────────────────
const withdraw = async (applicationId, applicantId) => {
  const repo = appRepo()
  const app  = await repo.findOne({ where: { id: applicationId } })
  if (!app) throw { status: 404, message: 'Candidature introuvable' }
  if (app.applicant?.id !== applicantId)
    throw { status: 403, message: 'Action non autorisée' }

  await repo.remove(app)
  return { message: 'Candidature retirée' }
}

module.exports = {
  apply,
  getMyApplications,
  getApplicationsForJob,
  getAllApplicationsForRecruiter,
  updateStatus,
  withdraw,
}