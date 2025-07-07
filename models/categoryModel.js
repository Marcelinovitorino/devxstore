const db = require('../config/db')

const createCategory = async (name) => {
  const result = await db.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING *',
    [name]
  )
  return result.rows[0]
}

const getAllCategories = async () => {
  const result = await db.query('SELECT * FROM categories')
  return result.rows
}

module.exports = {
  createCategory,
  getAllCategories,
}
