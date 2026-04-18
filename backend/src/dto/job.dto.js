// job.dto.js
const validateCreateJobDto = (body) => {
  const errors = []
  if (!body.title?.trim() || body.title.length < 5)
    errors.push('Titre : 5 caractères minimum')
  if (!body.description?.trim() || body.description.length < 20)
    errors.push('Description : 20 caractères minimum')
  if (!body.category?.trim())
    errors.push('Catégorie requise')
  if (!['freelance', 'cdi_cdd', 'stage'].includes(body.type))
    errors.push('Type invalide')
  if (body.budget !== undefined && isNaN(Number(body.budget)))
    errors.push('Budget invalide')
  if (body.budgetType && !['fixed', 'daily', 'monthly'].includes(body.budgetType))
    errors.push('budgetType invalide')
  return errors
}

module.exports = { validateCreateJobDto }