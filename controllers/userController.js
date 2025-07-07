const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createUser, findUserByEmail } = require('../models/userModel')

const register = async (req, res) => {
  const { name, email, password } = req.body
  const existing = await findUserByEmail(email)
  if (existing) return res.status(400).json({ error: 'Usuário já existe' })

  const hashed = await bcrypt.hash(password, 10)
  const user = await createUser(name, email, hashed)
  res.json({ id: user.id, name: user.name, email: user.email })
}

const login = async (req, res) => {
  const { email, password } = req.body
  const user = await findUserByEmail(email)
  if (!user) return res.status(400).json({ error: 'Credenciais inválidas' })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(400).json({ error: 'Credenciais inválidas' })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
  res.json({ token })
}

module.exports = {
  register,
  login
}
