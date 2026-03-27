# Test Checklist for Save Button and MongoDB

## Quick Start Instructions

### Step 1: Start MongoDB
```powershell
# Windows - Check if MongoDB is running
net start MongoDB

# If service doesn't exist, start mongod directly:
mongod --dbpath "C:\data\db"
```

Wait until you see: `[initandlisten] waiting for connections on port 27017`

### Step 2: Start Backend Server
```powershell
# In PowerShell terminal 1
cd backend
npm install  # Run once if not already done
npm start
```

Wait until you see:
- `Server is running on port 5000`
- `✅ MongoDB Connected`

### Step 3: Start Frontend Server
```powershell
# In PowerShell terminal 2
npm run dev
```

Wait until you see: `VITE ready in ... ms` and `Local: http://localhost:5173/`

---

## Testing Workflow

### Test 1: MongoDB Connection
1. Go to backend terminal
2. Look for: `✅ MongoDB Connected`
3. If you see error, check:
   - Is `mongod` running? (Check Windows Services)
   - Is port 27017 in use? Run: `netstat -ano | findstr :27017`

### Test 2: Login to Admin Portal
1. Open browser: http://localhost:5173/admin/login
2. Login with email: `admin@example.com`
3. Click "Login" button
4. Should redirect to: http://localhost:5173/admin
5. Should see sidebar with email displayed

### Test 3: Add a Product (Save Button Test)
1. Click "Products" in sidebar
2. Click "Add Product" button (blue button top-right)
3. **Modal dialog should open**

If modal doesn't open:
- Check browser console (F12 → Console tab)
- Look for JavaScript errors

### Test 4: Fill Out Form
1. **Name field**: "Test E-Commerce Site"
2. **Price field**: "150000"
3. **Category field**: "Web"
4. **Description**: "A test product"
5. **Image URL**: "https://via.placeholder.com/300"
6. **Downloads**: "5"
7. **Language**: "React"

### Test 5: Click Save Button
1. Look for the blue "Save Product" button at bottom right of modal
2. **Click it** - button should have blue background (#4FC3F7)

### Check Console for Debug Info

**In Browser Console (F12 → Console):**
- Should see: `Submitting product: {name: "...", price: ..., ...}`
- Should see: `Create response: {_id: "...", ...}`
- Should see: `Product created successfully` toast notification

**In Backend Terminal:**
- Should see: `📝 Creating product with data: {...}`
- Should see: `✅ Product created successfully: [MongoDB ID]`

---

## Troubleshooting Issues

### Issue 1: "Save Product button is not visible or clickable"

**Debug Steps:**
1. Open browser DevTools (F12)
2. Click "Add Product" → modal opens
3. Right-click on the form area → "Inspect"
4. Look for the button element:
```html
<button type="submit" class="bg-[#4FC3F7] ...">Save Product</button>
```

If button is missing:
- Check browser console for errors
- Try clearing browser cache: Ctrl+Shift+Del

If button is gray/disabled:
- Check if form has validation errors
- Try filling all required fields (Name is required)

### Issue 2: "Button click does nothing"

**Debug Steps:**
1. Add console.log in browser console:
```javascript
document.addEventListener('click', (e) => {
  if (e.target.textContent.includes('Save')) {
    console.log('Button clicked!', e.target)
  }
})
```
2. Click the button again
3. Check if console shows "Button clicked!"

If not showing:
- Form may not be properly rendered
- Try refreshing page
- Try logging out and back in

### Issue 3: "Form submits but nothing happens"

**Debug Steps:**
1. Check backend terminal for error messages
2. Look for: `❌ Error creating product: [error message]`
3. Check browser console for error toast notification

Common errors:
- "MongoDB Connected" not showing = MongoDB not running
- `Cannot connect to port 5000` = Backend not running
- `ENOTFOUND` = API URL misconfigured

### Issue 4: "Product appears in form but doesn't save to database"

**Debug Steps:**
1. Backend terminal should show: `✅ Product created successfully: [ID]`
2. If it doesn't, check for: `❌ Error creating product: ...`
3. Common reasons:
   - MongoDB service not running
   - Database connection issue
   - Schema validation failed

---

## Verify MongoDB is Working

### Option 1: Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Look for database: `kodemurah`
4. Look for collection: `products`
5. Check that products appear after saving

### Option 2: Using Mongo Shell
```bash
# Open command prompt and run:
mongo

# In mongo shell:
use kodemurah
db.products.find().pretty()
```

Should show all saved products with their data.

---

## File Locations for Reference

Backend files:
- `backend/server.js` - Main server file
- `backend/routes/product.routes.js` - Product CRUD routes with logging
- `backend/models/Product.model.js` - MongoDB schema
- `backend/.env` - Configuration (MONGO_URI, PORT)

Frontend files:
- `src/app/utils/api.ts` - API client with error handling
- `src/app/components/ProductForm.tsx` - Form component with Save button
- `src/app/pages/AdminProductsPage.tsx` - Products list and form logic
- `.env.local` - Frontend API configuration

---

## Success Indicators

✅ Backend terminal shows: "✅ MongoDB Connected"
✅ Admin login works with admin@example.com
✅ Products page loads without errors
✅ "Add Product" button opens modal dialog
✅ Form fills out successfully
✅ "Save Product" button is visible and blue
✅ Clicking Save shows success notification
✅ Product appears in table immediately
✅ Backend terminal shows: "✅ Product created successfully: [ID]"
✅ New product persists after page refresh
✅ MongoDB Compass shows new products in database

---

## Quick Commands

```powershell
# Kill all node processes
Get-Process node | Stop-Process -Force

# Start backend in background
Start-Job -ScriptBlock {
  cd 'c:\Users\rizki\Downloads\E-Commerce UI Design\backend'
  npm start
}

# Check MongoDB status
Get-Service MongoDB

# Start MongoDB service
Start-Service MongoDB

# Stop MongoDB service
Stop-Service MongoDB
```

---

If you follow these steps and still have issues, collect the following info:
1. Screenshot of browser console error (F12)
2. Last 10 lines of backend terminal output
3. Browser URL when issue occurs
4. Exact steps you performed before issue appeared
