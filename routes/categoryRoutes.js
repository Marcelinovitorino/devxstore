const express = require('express')
const router = express.Router()
const { addCategory, listCategories } = require('../controllers/categoryController')

router.post('/', addCategory)
router.get('/', listCategories)

module.exports = router
