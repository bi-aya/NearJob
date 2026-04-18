const { AppDataSource } = require('../data-source')// Ajuste le chemin selon ton projet
const CompetenceSchema = require('../entities/Competence')

// Helper pour récupérer le repository
const competenceRepo = () => AppDataSource.getRepository(CompetenceSchema)

// ─── Récupérer toutes les compétences ─────────────────────────────────
const getAllCompetences = async () => {
  const repo = competenceRepo()
  return await repo.find()
}

// ─── Récupérer une compétence par ID ──────────────────────────────────
const getCompetenceById = async (id) => {
  const repo = competenceRepo()
  const competence = await repo.findOne({ where: { id } })
  if (!competence) throw { status: 404, message: 'Compétence introuvable' }
  return competence
}

// ─── Créer une compétence ─────────────────────────────────────────────
const createCompetence = async (name) => {
  const repo = competenceRepo()
  
  // Optionnel : vérifier si elle existe déjà
  const exists = await repo.findOne({ where: { name } })
  if (exists) throw { status: 400, message: 'Cette compétence existe déjà' }

  const newCompetence = repo.create({ name })
  return await repo.save(newCompetence)
}

// ─── Mettre à jour une compétence ─────────────────────────────────────
const updateCompetence = async (id, name) => {
  const repo = competenceRepo()
  const competence = await repo.findOne({ where: { id } })
  
  if (!competence) throw { status: 404, message: 'Compétence introuvable' }
  
  competence.name = name
  return await repo.save(competence)
}

// ─── Supprimer une compétence ─────────────────────────────────────────
const deleteCompetence = async (id) => {
  const repo = competenceRepo()
  const competence = await repo.findOne({ where: { id } })

  if (!competence) throw { status: 404, message: 'Compétence introuvable' }

  await repo.remove(competence)
  return { message: 'Compétence supprimée avec succès' }
}

module.exports = { 
  getAllCompetences, 
  getCompetenceById, 
  createCompetence, 
  updateCompetence, 
  deleteCompetence 
}