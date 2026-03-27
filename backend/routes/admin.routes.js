const express = require('express')
const router = express.Router()
const Admin = require('../models/Admin.model')

router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find().select('-password')
    res.json(admins)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const admin = new Admin(req.body)
    admin.lastPassword = req.body.password
    await admin.save()
    res.status(201).json({ 
      admin: { 
        _id: admin._id, 
        name: admin.name, 
        email: admin.email, 
        role: admin.role,
        lastPassword: admin.lastPassword 
      } 
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete admin
router.delete('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id)
    if (!admin) return res.status(404).json({ message: 'Admin not found' })
    
    if (admin.email === 'admin@example.com') {
      return res.status(400).json({ message: 'Cannot delete default admin' })
    }
    
    await Admin.findByIdAndDelete(req.params.id)
    res.json({ message: 'Admin deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update admin (change password)
router.put('/:id', async (req, res) => {
  try {
    const { password } = req.body
    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    const admin = await Admin.findById(req.params.id)
    if (!admin) return res.status(404).json({ message: 'Admin not found' })

    admin.password = password
    admin.lastPassword = password
    await admin.save()
    
    res.json({ 
      message: 'Password changed successfully', 
      admin: { 
        _id: admin._id, 
        name: admin.name, 
        email: admin.email, 
        role: admin.role,
        lastPassword: admin.lastPassword 
      } 
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Verify email + password
router.post('/verify', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(401).json({ message: 'Email not found' })
    }

    const isPasswordValid = await admin.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    res.json({ 
      success: true, 
      admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role } 
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
