const db = require('../config/db')

const createProduct = async (name, description, price, stock, category_id, image_urls = []) => {
  const result = await db.query(
    `INSERT INTO products (name, description, price, stock, category_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, description, price, stock, category_id]
  )
  const product = result.rows[0]

  for (const url of image_urls) {
    await db.query(
      'INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)',
      [product.id, url]
    )
  }

  return getProductById(product.id)
}

const getProductById = async (id) => {
  const productRes = await db.query('SELECT * FROM products WHERE id = $1', [id])
  const imagesRes = await db.query('SELECT image_url FROM product_images WHERE product_id = $1', [id])
  const product = productRes.rows[0]
  if (product) {
    product.images = imagesRes.rows.map(row => row.image_url)
  }
  return product
}

const getAllProducts = async () => {
  const productsRes = await db.query('SELECT * FROM products')
  const products = []

  for (const p of productsRes.rows) {
    const imagesRes = await db.query('SELECT image_url FROM product_images WHERE product_id = $1', [p.id])
    p.images = imagesRes.rows.map(row => row.image_url)
    products.push(p)
  }

  return products
}

const deleteImagesByProductId = async (productId) => {
  await db.query('DELETE FROM product_images WHERE product_id = $1', [productId])
}

const addImagesToProduct = async (productId, image_urls) => {
  for (const url of image_urls) {
    await db.query('INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)', [productId, url])
  }
}

const updateProductData = async (id, name, description, price, stock, category_id) => {
  const result = await db.query(
    `UPDATE products
     SET name = $1, description = $2, price = $3, stock = $4, category_id = $5
     WHERE id = $6
     RETURNING *`,
    [name, description, price, stock, category_id, id]
  )
  return result.rows[0]
}

const deleteProduct = async (id) => {
  await db.query('DELETE FROM product_images WHERE product_id = $1', [id])
  await db.query('DELETE FROM products WHERE id = $1', [id])
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteImagesByProductId,
  addImagesToProduct,
  updateProductData,
  deleteProduct
}