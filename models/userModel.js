const db = require('../config/db')

const createUser = async (name, email, hashedPassword) => {
  const result = await db.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, hashedPassword]
  )
  return result.rows[0]
}

const findUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email])
  return result.rows[0]
}

module.exports = {
  createUser,
  findUserByEmail
}
