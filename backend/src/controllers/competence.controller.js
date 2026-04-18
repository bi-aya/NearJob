const competenceService = require('../services/competence.service')

const getAll = async (req, res) => {
  try {
    const data = await competenceService.getAllCompetences()
    res.json(data)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

const getById = async (req, res) => {
  try {
    const data = await competenceService.getCompetenceById(req.params.id)
    res.json(data)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

const create = async (req, res) => {
  try {
    const { name } = req.body
    const data = await competenceService.createCompetence(name)
    res.status(201).json(data)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

const update = async (req, res) => {
  try {
    const { name } = req.body
    const data = await competenceService.updateCompetence(req.params.id, name)
    res.json(data)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

const remove = async (req, res) => {
  try {
    const result = await competenceService.deleteCompetence(req.params.id)
    res.json(result)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

module.exports = { getAll, getById, create, update, remove }