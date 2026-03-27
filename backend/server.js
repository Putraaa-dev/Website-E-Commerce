require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const fs = require("fs")
const serverless = require("serverless-http")

const app = express()

app.use(cors())
app.use(express.json())


const uploadsDir = "/tmp/uploads"
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}


app.use("/uploads", express.static(uploadsDir))


let isConnected = false
async function connectDB() {
  if (isConnected) return

  if (!process.env.MONGO_URI) {
    console.warn("⚠️ MONGO_URI not set")
    return
  }

  try {
    await mongoose.connect(process.env.MONGO_URI)
    isConnected = true
    console.log("✅ MongoDB Connected")

    
    const Admin = require("../backend/models/Admin.model")
    const count = await Admin.countDocuments()

    if (count === 0) {
      await Admin.create({
        name: "Super Admin",
        email: "admin@example.com",
        password: "admin123",
        lastPassword: "admin123",
        role: "admin",
      })
      console.log("✅ Default admin created")
    }
  } catch (err) {
    console.error("❌ MongoDB Error:", err)
  }
}


app.use(async (req, res, next) => {
  await connectDB()
  next()
})


app.use("/api/products", require("../backend/routes/product.routes.js"))
app.use("/api/admins", require("../backend/routes/admin.routes.js"))


app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "API jalan di Vercel 🚀" })
})

app.get("/", (req, res) => {
  res.send("Backend KodeMurah Running 🚀")
})


module.exports = serverless(app)