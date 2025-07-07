const { createCategory, getAllCategories } = require('../models/categoryModel')

const addCategory = async (req, res) => {
  try {
    const { name } = req.body
    const category = await createCategory(name)
    res.status(201).json(category)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar categoria' })
  }
}

const listCategories = async (req, res) => {
  try {
    const categories = await getAllCategories()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar categorias' })
  }
}

module.exports = {
  addCategory,
  listCategories,
}
