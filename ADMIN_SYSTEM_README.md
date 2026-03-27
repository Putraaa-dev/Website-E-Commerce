# KodeMurah Admin Portal - Setup & Usage Guide

## Overview
KodeMurah is an e-commerce platform for source code and digital products with a complete admin dashboard system.

## System Architecture

### Frontend (React + TypeScript)
- **Location**: `src/app/`
- **Server**: Vite (http://localhost:5174)
- **API Base**: http://localhost:5000/api

### Backend (Node.js + Express)
- **Location**: `backend/`
- **Server**: Node.js (http://localhost:5000)
- **Database**: MongoDB

### Admin Authentication
- Protected routes using React Context API
- Email-based login verification
- localStorage for session persistence
- Automatic redirect to login for unauthorized access

---

## Getting Started

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```
The backend will run on **http://localhost:5000**

### 2. Start Frontend Dev Server
```bash
cd .. (go back to root)
npm install
npm run dev
```
The frontend will run on **http://localhost:5174**

---

## Admin Portal Access

### Login Page
- **URL**: http://localhost:5174/admin/login
- **Default Admin Email**: admin@example.com
- **Note**: The system verifies the email exists in the MongoDB admin collection

### Admin Dashboard
- **URL**: http://localhost:5174/admin
- **Features**:
  - Dashboard with statistics
  - Product Management (CRUD)
  - User/Admin Management
  - Logout functionality

---

## Features & Pages

### 1. Admin Login (`/admin/login`)
- Email verification against admin database
- Error handling with user-friendly messages
- Default credentials shown for testing
- Pre-filled with demo account

### 2. Dashboard (`/admin`)
- Real-time statistics:
  - Total Products count
  - Total Downloads
  - Total Admins
- Quick action buttons
- Welcome message

### 3. Products Management (`/admin/products`)
- **Features**:
  - Add new products (modal form)
  - Edit existing products
  - Delete products with confirmation
  - Search and filter
  - Display all products in a table

**Form Fields**:
- Name (required)
- Price (number)
- Category
- Description
- Image URL
- Downloads count
- Language/Tech specs

### 4. Users Management (`/admin/users`)
- **Features**:
  - View all admin users
  - Add new admin users
  - Display email and role

---

## Project Structure

```
E-Commerce UI Design/
├── backend/
│   ├── server.js
│   ├── models/
│   │   ├── Product.model.js
│   │   └── Admin.model.js
│   └── routes/
│       ├── product.routes.js
│       └── admin.routes.js
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProtectedAdminRoute.tsx
│   │   │   └── ui/ (shadcn components)
│   │   ├── context/
│   │   │   ├── AdminContext.tsx (Auth management)
│   │   │   └── CartContext.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── AdminLoginPage.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminProductsPage.tsx
│   │   │   ├── AdminUsersPage.tsx
│   │   │   ├── ProtectedAdminHome.tsx
│   │   │   ├── ProtectedAdminProducts.tsx
│   │   │   └── ProtectedAdminUsers.tsx
│   │   └── routes.ts (Route definitions with protection)
│   └── main.tsx
│
├── .env.local (Frontend API config)
├── tsconfig.json
└── vite.config.ts
```

---

## API Endpoints

### Products
- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Fetch single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Admins
- `GET /api/admins` - Fetch all admins
- `POST /api/admins` - Create admin

### API Root
- `GET /api` - Health check endpoint

---

## Testing the System

### 1. Add a Product
1. Go to `/admin/products`
2. Click "Add Product" button
3. Fill in the form
4. Click "Save"
5. Product will appear in the table

### 2. Edit a Product
1. Click the Edit button (pencil icon)
2. Modal opens with pre-filled data
3. Modify fields
4. Click "Save"

### 3. Delete a Product
1. Click the Delete button (trash icon)
2. Product is removed from table

### 4. Manage Admins
1. Go to `/admin/users`
2. Click "Add Admin"
3. Enter email and name
4. Click "Save"

### 5. Logout
1. Click "Logout" button in sidebar
2. Redirected to login page
3. Session cleared from localStorage

---

## Authentication Flow

```
User visits /admin
    ↓
ProtectedAdminRoute checks isAdmin status
    ↓
If NOT authenticated → Redirect to /admin/login
    ↓
User enters email on login page
    ↓
AdminContext verifies email against DB
    ↓
If found → Login successful, redirect to /admin
If NOT found → Show error message
    ↓
Email stored in localStorage
    ↓
User can access admin pages
    ↓
Logout clears localStorage
    ↓
User redirected to /admin/login
```

---

## Environment Variables

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://... (optional for testing without Mongo)
```

---

## Troubleshooting

### "Cannot access admin pages"
- Check if you're logged in
- Login page should appear at `/admin/login`
- Verify email exists in admin database

### "Failed to load products"
- Ensure backend is running on port 5000
- Check if MongoDB is connected
- Check browser console for API errors

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5174 (frontend)
lsof -ti:5174 | xargs kill -9
```

### MongoDB Connection Issues
- System works without MongoDB (mock mode)
- To enable persistence, set MONGO_URI in backend/.env
- Example: `MONGO_URI=mongodb://localhost:27017/kodemurah`

---

## Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router v7
- **Backend**: Node.js, Express.js 5, MongoDB/Mongoose
- **UI Components**: shadcn/ui, Lucide React icons
- **Forms**: react-hook-form
- **Notifications**: sonner
- **Build**: Vite

---

## Notes

- All form submissions are validated on the frontend
- API errors are logged to browser console for debugging
- Admin emails are case-insensitive in verification
- Sessions persist across page refreshes (localStorage)
- Protected routes automatically redirect unauthorized users

---

## Support

For issues or questions, check:
1. Browser console for error messages
2. Backend server logs for API errors
3. Ensure both frontend and backend servers are running
4. Verify MongoDB connection if using persistence
