const { AppDataSource } = require('../data-source')
const path = require('path')
const fs   = require('fs')
const CompetenceSchema = require('../entities/Competence');
const { In } = require('typeorm')

const userRepo = () => AppDataSource.getRepository('User')

const xpRepo = () => AppDataSource.getRepository('Experience')


// ─── Nettoyer le user avant de renvoyer ──────────────────────────────
const safeUser = (user) => {
  const { passwordHash, ...rest } = user
  return rest
}

// ─── GET profil complet ───────────────────────────────────────────────
const getProfile = async (userId) => {
  const user = await userRepo().findOne({
    where: { id: userId },
    relations: ['competences', 'experiences'],
  })
  if (!user) throw { status: 404, message: 'Utilisateur introuvable' }
  return safeUser(user)
}

// ─── UPDATE profil ────────────────────────────────────────────────────
const updateProfile = async (userId, data) => {
  const repo = userRepo()
  const user = await repo.findOne({ where: { id: userId } })
  if (!user) throw { status: 404, message: 'Utilisateur introuvable' }

  const allowed = ['firstName', 'lastName', 'bio', 'category', 'dailyRate', 'city']
  allowed.forEach((key) => {
    if (data[key] !== undefined) user[key] = data[key]
  })

  await repo.save(user)
  return safeUser(user)
}

// ─── TOGGLE disponibilité ─────────────────────────────────────────────
const toggleAvailability = async (userId) => {
  const repo = userRepo()
  const user = await repo.findOne({ where: { id: userId } })
  if (!user) throw { status: 404, message: 'Utilisateur introuvable' }

  user.isAvailable = !user.isAvailable
  await repo.save(user)
  return { isAvailable: user.isAvailable }
}

// ─── UPDATE localisation ──────────────────────────────────────────────
const updateLocation = async (userId, { latitude, longitude }) => {
  const repo = userRepo()
  const user = await repo.findOne({ where: { id: userId } })
  if (!user) throw { status: 404, message: 'Utilisateur introuvable' }

  user.latitude  = latitude
  user.longitude = longitude
  await repo.save(user)
  return { latitude, longitude }
}



// ─── ADD expérience ───────────────────────────────────────────────────
const addExperience = async (userId, data) => {
  const repo = xpRepo()
  const xp   = repo.create({
    ...data,
    user: { id: userId },
  })
  await repo.save(xp)
  return xp
}

// ─── DELETE expérience ────────────────────────────────────────────────
const deleteExperience = async (userId, xpId) => {
  const repo = xpRepo()
  const xp   = await repo.findOne({
    where: { id: xpId, user: { id: userId } },
  })
  if (!xp) throw { status: 404, message: 'Expérience introuvable' }
  await repo.remove(xp)
  return { deleted: true }
}

// ─── UPDATE push token ────────────────────────────────────────────────
const updatePushToken = async (userId, pushToken) => {
  const repo = userRepo()
  await repo.update({ id: userId }, { pushToken })
  return { updated: true }
}

// ─── UPDATE avatar (URL après upload) ────────────────────────────────
const updateAvatar = async (userId, avatarUrl) => {
  const repo = userRepo()
  const user = await repo.findOne({ where: { id: userId } })
  if (!user) throw { status: 404, message: 'Utilisateur introuvable' }
  user.avatar = avatarUrl
  await repo.save(user)
  return { avatar: avatarUrl }
}


const updateCompetences = async (userId, competenceIds) => {
  const userRepository = AppDataSource.getRepository('User')
  const compRepository = AppDataSource.getRepository(CompetenceSchema)

  // 1. récupérer user avec competences actuelles
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ['competences'],
  })

  if (!user) {
    throw { status: 404, message: 'Utilisateur introuvable' }
  }

  // 2. nettoyer ids
  const ids = Array.isArray(competenceIds)
    ? competenceIds.map((id) => Number(id)).filter(Boolean)
    : []

  if (ids.length === 0) return user

  // 3. récupérer nouvelles competences
  const newCompetences = await compRepository.find({
    where: { id: In(ids) },
  })

  // 4. merge sans doublons
  const existingIds = user.competences.map((c) => c.id)

  const merged = [
    ...user.competences,
    ...newCompetences.filter((c) => !existingIds.includes(c.id)),
  ]

  user.competences = merged

  // 5. save
  await userRepository.save(user)

  // 6. return updated
  return await userRepository.findOne({
    where: { id: userId },
    relations: ['competences'],
  })
}
module.exports = {
  getProfile,
  updateProfile,
  toggleAvailability,
  updateLocation,
   updateCompetences,
  addExperience,
  deleteExperience,
  updatePushToken,
  updateAvatar,
}
