const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastPassword: { type: String }, // Menyimpan password plain text untuk display
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
)

// Hash password before saving
adminSchema.pre('save', async function() {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Method to verify password
adminSchema.methods.comparePassword = async function(inputPassword) {
  return await bcrypt.compare(inputPassword, this.password)
}

module.exports = mongoose.model('Admin', adminSchema)
