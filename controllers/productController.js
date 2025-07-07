const cloudinary = require('../config/cloudinary')
const { 
  createProduct, 
  getAllProducts,
  getProductById,
  deleteImagesByProductId,
  addImagesToProduct,
  updateProductData,
  deleteProduct
} = require('../models/produtModel')

const uploadToCloudinary = async (files) => {
  const uploadPromises = files.map(file => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result.secure_url)
        }
      )
      uploadStream.end(file.buffer)
    })
  })
  return Promise.all(uploadPromises)
}

const addProductWithImageUpload = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body
    const files = req.files

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Pelo menos uma imagem é necessária' })
    }

    const image_urls = await uploadToCloudinary(files)
    const product = await createProduct(name, description, price, stock, category_id, image_urls)
    res.status(201).json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar produto' })
  }
}

const listProducts = async (req, res) => {
  try {
    const products = await getAllProducts()
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar produtos' })
  }
}

const getProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produto' })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, price, stock, category_id } = req.body
    const files = req.files

    // Atualizar dados básicos do produto
    const updatedProduct = await updateProductData(
      id,
      name,
      description,
      price,
      stock,
      category_id
    )

    // Se houver novas imagens, substituir as antigas
    if (files && files.length > 0) {
      const image_urls = await uploadToCloudinary(files)
      await deleteImagesByProductId(id)
      await addImagesToProduct(id, image_urls)
    }

    // Retornar o produto completo atualizado
    const finalProduct = await getProductById(id)
    res.json(finalProduct)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar produto' })
  }
}

const deleteProductHandler = async (req, res) => {
  try {
    const { id } = req.params
    await deleteProduct(id)
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao deletar produto' })
  }
}

module.exports = {
  addProductWithImageUpload,
  listProducts,
  getProductById: getProduct,
  updateProduct,
  deleteProduct: deleteProductHandler
}