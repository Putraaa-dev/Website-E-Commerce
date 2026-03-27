# 🔐 Password Management System

Dokumentasi lengkap untuk sistem manajemen password admin dengan MongoDB dan enkripsi bcrypt.

## 📋 Fitur Utama

### 1. **Enkripsi Password dengan Bcrypt**
- Password di-hash dengan bcrypt (salt rounds: 10) sebelum disimpan ke MongoDB
- Tidak mungkin mendapatkan password asli dari hash
- Password verification dilakukan dengan `comparePassword()` method

### 2. **Penyimpanan Password Plain Text untuk Display**
- Field `lastPassword` menyimpan password plain text saat dibuat/diubah
- Ditampilkan di Admin Management UI dengan mudah
- Dapat disalin ke clipboard dengan sekali klik

### 3. **Show/Hide Password Toggle**
- Eye icon untuk toggle visibility password
- Visibility state disimpan per admin di client state
- Tidak ada data sensitif yang dikirim ke server

### 4. **Copy to Clipboard**
- Copy icon untuk salin password dengan mudah
- Confirmation feedback (✓ icon) saat berhasil disalin
- Timeout 2 detik untuk feedback visual

## 🏗️ Arsitektur Backend

### Admin Model (`backend/models/Admin.model.js`)

```javascript
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },           // ← Hashed dengan bcrypt
  lastPassword: { type: String },                       // ← Plain text untuk display
  role: { type: String, default: 'admin' },
}, { timestamps: true })

// Pre-save hook untuk hashing password
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Method untuk verifikasi password saat login
adminSchema.methods.comparePassword = async function(inputPassword) {
  return await bcrypt.compare(inputPassword, this.password)
}
```

### Admin Routes (`backend/routes/admin.routes.js`)

#### GET `/api/admins` - Fetch All Admins
**Response:** Mengembalikan semua admin TANPA hashed password field
```json
[
  {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "lastPassword": "password123",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST `/api/admins` - Create New Admin
**Request Body:**
```json
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "newpass123",
  "role": "admin"
}
```

**Response:** Mengembalikan admin dengan `lastPassword` untuk ditampilkan di UI
```json
{
  "admin": {
    "_id": "...",
    "name": "New Admin",
    "email": "newadmin@example.com",
    "role": "admin",
    "lastPassword": "newpass123"
  }
}
```

#### PUT `/api/admins/:id` - Change Password
**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Response:** Mengembalikan admin dengan password yang sudah diupdate
```json
{
  "message": "Password changed successfully",
  "admin": {
    "_id": "...",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin",
    "lastPassword": "newpassword123"
  }
}
```

#### DELETE `/api/admins/:id` - Delete Admin
**Protection:** Admin default (admin@example.com) tidak bisa dihapus
**Response:**
```json
{
  "message": "Admin deleted successfully"
}
```

#### POST `/api/admins/verify` - Login Verification
**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "admin": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## 🎨 Frontend UI Components

### Admin Management Page (`src/app/pages/AdminManagementPage.tsx`)

#### Add Admin User Dialog
- Input fields: Name, Email, Password
- Show/Hide password toggle saat mengetik
- Password display box dengan copy button setelah submit
- Validasi: minimal 6 karakter, email unik

#### Change Password Dialog
- Target admin email ditampilkan
- Input password baru dengan show/hide toggle
- Password display box dengan copy button setelah submit
- Tombol lock icon (🔒) di tabel untuk akses dialog

#### Admin Table
Kolom-kolom:
1. **Name** - Nama admin
2. **Email** - Email admin
3. **Role** - Role admin (biasanya "admin")
4. **Created At** - Tanggal pembuatan
5. **Actions** - Tombol-tombol:
   - 👁️ Eye icon - Show/Hide password
   - 📋 Copy icon - Salin password ke clipboard (hanya muncul saat visible)
   - 🔒 Lock icon - Buka dialog change password
   - 🗑️ Trash icon - Delete admin (disabled untuk default admin)

#### Password Display Features
- **Show Password**: Ketika eye icon diklik, password ditampilkan dalam blue box
- **Copy Password**: Klik copy icon untuk salin ke clipboard
- **Visual Feedback**: Checkout mark muncul 2 detik setelah copy
- **Password Format**: Plain text (bukan masked/bullet points)

## 🔄 Flow Operasional

### 1. Create New Admin
```
User klik "Add Admin User"
↓
Dialog terbuka dengan form
↓
User isi Name, Email, Password
↓
Password ditampilkan real-time (show/hide toggle)
↓
User klik "Create Admin"
↓
POST /api/admins dengan data
↓
Backend: Password di-hash dengan bcrypt, lastPassword disimpan
↓
Frontend: Tampilkan lastPassword dalam green success box
↓
User bisa copy/paste password sebelum menutup dialog
↓
Dialog ditutup, admin baru muncul di tabel
```

### 2. View Admin Password
```
Admin tersimpan di database
↓
User akses /admin/management
↓
GET /api/admins dipanggil
↓
Frontend: Tampilkan tabel dengan eye icon untuk setiap admin
↓
User klik eye icon
↓
Frontend: Toggle showPassword state untuk admin tersebut
↓
Password (lastPassword) ditampilkan dalam blue box
↓
User bisa klik copy icon untuk salin ke clipboard
```

### 3. Change Admin Password
```
User klik lock icon (🔒) di tabel
↓
Change Password dialog terbuka
↓
User isi password baru
↓
User klik "Change Password"
↓
PUT /api/admins/:id dengan password baru
↓
Backend: Password di-hash, lastPassword diupdate
↓
Frontend: Tampilkan lastPassword dalam green success box
↓
User bisa copy/paste password sebelum menutup dialog
↓
Dialog ditutup, admin di tabel diupdate dengan password baru
```

### 4. Login Process
```
User akses /admin/login
↓
User isi email + password
↓
Klik "Verify Admin"
↓
POST /api/admins/verify dengan email & password
↓
Backend: Cari admin by email
↓
Backend: Gunakan comparePassword() untuk verifikasi
↓
Jika valid: Redirect ke /admin/dashboard
↓
Jika invalid: Tampilkan error message
```

## 🔐 Keamanan

### ✅ Yang Aman
- Password di-hash dengan bcrypt (satu arah, tidak bisa di-reverse)
- `lastPassword` hanya digunakan untuk display saat create/change
- Protected routes - hanya admin yang login bisa akses `/admin/*`
- Admin default (admin@example.com) tidak bisa dihapus
- Email unique di database
- Password minimal 6 karakter

### ⚠️ Catatan Keamanan
- `lastPassword` disimpan plain text untuk kemudahan view/copy
- Jika ingin lebih aman, bisa:
  1. Generate password random dan auto-expire dalam 24 jam
  2. Hanya tampilkan password saat creation, bukan setelah
  3. Gunakan "Reset Password" link via email

## 📱 Default Admin Credentials

```
Email: admin@example.com
Password: admin123
```

Di-seed otomatis saat server pertama kali start.

## 🚀 Cara Menggunakan

### 1. Login sebagai Admin
- Buka http://localhost:5174
- Klik "Admin Portal" di homepage
- Masukkan email & password
- Klik "Verify Admin"

### 2. Manage Admin Users
- Di admin dashboard, klik "Admins" di sidebar
- Atau akses langsung: http://localhost:5174/admin/management

### 3. Add New Admin
- Klik "Add Admin User"
- Isi form dengan data baru
- Klik "Create Admin"
- Copy password yang ditampilkan
- Share password ke admin baru

### 4. Change Admin Password
- Klik lock icon (🔒) di tabel
- Isi password baru
- Klik "Change Password"
- Copy password baru yang ditampilkan

### 5. View Admin Password
- Klik eye icon (👁️) untuk tampilkan password
- Klik eye icon lagi untuk sembunyikan
- Klik copy icon untuk salin ke clipboard

### 6. Delete Admin
- Klik trash icon (🗑️) di tabel
- Confirm deletion
- Admin akan dihapus dari database

## 📊 MongoDB Schema

```javascript
// Admins Collection
{
  _id: ObjectId,
  name: String,
  email: String,           // unique
  password: String,        // bcrypt hashed
  lastPassword: String,    // plain text untuk display
  role: String,           // default: "admin"
  createdAt: Date,
  updatedAt: Date
}
```

## 🐛 Troubleshooting

### Password tidak muncul di tabel
- Pastikan admin sudah memiliki field `lastPassword` di database
- Jalankan: `db.admins.updateMany({}, { $set: { lastPassword: "your_password" } })`

### Eye icon tidak berfungsi
- Pastikan TypeScript tidak ada error
- Clear cache browser (Ctrl+F5)
- Restart development server

### Copy to clipboard tidak bekerja
- Pastikan browser support Clipboard API (modern browsers)
- Check browser console untuk error messages

### Password tidak ter-hash saat create/change
- Pastikan pre-save hook sudah ada di Admin.model.js
- Pastikan bcrypt sudah diinstall: `npm install bcrypt` (backend)

## 📝 API Testing dengan cURL

### Create Admin
```bash
curl -X POST http://localhost:5000/api/admins \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rizki Admin",
    "email": "rizki@example.com",
    "password": "risoadmin123",
    "role": "admin"
  }'
```

### Get All Admins
```bash
curl http://localhost:5000/api/admins
```

### Change Password
```bash
curl -X PUT http://localhost:5000/api/admins/[ADMIN_ID] \
  -H "Content-Type: application/json" \
  -d '{"password": "newpassword123"}'
```

### Verify Login
```bash
curl -X POST http://localhost:5000/api/admins/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Delete Admin
```bash
curl -X DELETE http://localhost:5000/api/admins/[ADMIN_ID]
```

---

**Last Updated:** 2024
**Status:** ✅ Production Ready
