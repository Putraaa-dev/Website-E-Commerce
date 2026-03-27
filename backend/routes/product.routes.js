const express = require("express")
const router = express.Router()
const Product = require("../models/Product.model")
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'))
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `${unique}${ext}`)
  }
})

const upload = multer({ storage })


router.post("/", upload.single('image'), async (req, res) => {
  try {
    const productData = { ...req.body }
    if (req.file) productData.image = req.file.filename
    // parse techSpecs when sent as JSON string in FormData
    if (productData.techSpecs && typeof productData.techSpecs === 'string') {
      try {
        productData.techSpecs = JSON.parse(productData.techSpecs)
      } catch (e) {
        productData.techSpecs = { language: productData.techSpecs }
      }
    }
    // coerce numeric fields
    if (productData.price !== undefined) productData.price = Number(productData.price) || 0
    if (productData.downloads !== undefined) productData.downloads = Number(productData.downloads) || 0
    console.log('📝 Creating product with data:', productData)
    const product = new Product(productData)
    await product.save()
    console.log('✅ Product created successfully:', product._id)
    res.status(201).json(product)
  } catch (error) {
    console.error('❌ Error creating product:', error.message)
    res.status(400).json({ message: error.message })
  }
})


router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


router.put("/:id", upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body }
    if (req.file) updateData.image = req.file.filename
    if (updateData.techSpecs && typeof updateData.techSpecs === 'string') {
      try {
        updateData.techSpecs = JSON.parse(updateData.techSpecs)
      } catch (e) {
        updateData.techSpecs = { language: updateData.techSpecs }
      }
    }
    if (updateData.price !== undefined) updateData.price = Number(updateData.price) || 0
    if (updateData.downloads !== undefined) updateData.downloads = Number(updateData.downloads) || 0
    console.log(`📝 Updating product ${req.params.id} with data:`, updateData)
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    if (!updated) {
      console.warn('⚠️ Product not found:', req.params.id)
      return res.status(404).json({ message: 'Product not found' })
    }
    console.log('✅ Product updated successfully:', updated._id)
    res.json(updated)
  } catch (error) {
    console.error('❌ Error updating product:', error.message)
    res.status(400).json({ message: error.message })
  }
})


router.delete("/:id", async (req, res) => {
  try {
    console.log(`🗑️ Deleting product: ${req.params.id}`)
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) {
      console.warn('⚠️ Product not found:', req.params.id)
      return res.status(404).json({ message: 'Product not found' })
    }
    console.log('✅ Product deleted successfully:', req.params.id)
    res.json({ message: "Produk berhasil dihapus" })
  } catch (error) {
    console.error('❌ Error deleting product:', error.message)
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
