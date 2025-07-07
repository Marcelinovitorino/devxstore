const multer = require('multer')
const path = require('path')

// Armazenamento em memória
const storage = multer.memoryStorage()

// Filtro de imagem
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    cb(null, true)
  } else {
    cb(new Error('Somente imagens são permitidas'), false)
  }
}

const upload = multer({ storage, fileFilter })

module.exports = upload
