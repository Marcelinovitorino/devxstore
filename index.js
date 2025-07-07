const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')

dotenv.config()

const app = express()

// Habilita CORS para todas as origens (ou configure conforme necessário)
app.use(cors())

// Middleware para ler JSON
app.use(express.json())

// // Rota de teste
// app.get('/', (req, res) => {
//   res.send('API E-commerce Básica com CommonJS funcionando!')
// })

// Rotas da API
app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)

// Iniciar o servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
