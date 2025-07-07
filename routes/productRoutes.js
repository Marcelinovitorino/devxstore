const express = require('express')
const router = express.Router()
const upload = require('../config/upload')
const { 
  addProductWithImageUpload, 
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController')

router.post('/', upload.array('images', 5), addProductWithImageUpload)
router.get('/', listProducts)
router.get('/:id', getProductById)
router.put('/:id', upload.array('images', 5), updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router