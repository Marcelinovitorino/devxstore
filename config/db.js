const { Pool } = require('pg')
require('dotenv').config()

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon exige SSL
  }
})

// Teste de conexão com uma query simples
db.query('SELECT NOW()')
  .then(result => {
    console.log('🟢 Conectado com sucesso ao Neon PostgreSQL!')
    console.log('📅 Data atual do servidor PostgreSQL:', result.rows[0])
  })
  .catch(err => {
    console.error('🔴 Erro ao conectar com o banco:', err.message)
  })

module.exports = db
