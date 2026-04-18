// users.dto.js
const validateUpdateProfileDto = (body) => {
  const errors = []
  if (body.firstName !== undefined && typeof body.firstName !== 'string')
    errors.push('firstName doit être une chaîne')
  if (body.lastName !== undefined && typeof body.lastName !== 'string')
    errors.push('lastName doit être une chaîne')
  if (body.bio !== undefined && body.bio.length > 500)
    errors.push('bio ne peut pas dépasser 500 caractères')
  if (body.dailyRate !== undefined && isNaN(Number(body.dailyRate)))
    errors.push('dailyRate doit être un nombre')
  return errors
}

const validateSkillsDto = (body) => {
  const errors = []
  if (!Array.isArray(body.competenceIds))
    errors.push('competenceIds doit être un tableau')
  return errors
}

const validateExperienceDto = (body) => {
  const errors = []
  if (!body.title?.trim()) errors.push('Le titre est requis')
  if (!body.company?.trim()) errors.push("L'entreprise est requise")
  if (!body.startDate) errors.push('La date de début est requise')
  return errors
}

module.exports = { validateUpdateProfileDto, validateSkillsDto, validateExperienceDto }