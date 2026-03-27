export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function fetchProduct(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`)
  if (!res.ok) throw new Error('Failed to fetch product')
  return res.json()
}

export async function createProduct(data: any) {
  try {
    console.log('API: Creating product')
    let res
    if (data instanceof FormData) {
      res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        body: data,
      })
    } else {
      console.log('API: Creating product with JSON data:', data)
      res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    }
    if (!res.ok) {
      const errorText = await res.text()
      console.error(`API Error (${res.status}):`, errorText)
      throw new Error(`API Error ${res.status}: ${errorText}`)
    }
    const result = await res.json()
    console.log('API: Product created:', result)
    return result
  } catch (err) {
    console.error('createProduct error:', err)
    throw err
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    console.log(`API: Updating product ${id}`)
    let res
    if (data instanceof FormData) {
      res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        body: data,
      })
    } else {
      console.log(`API: Updating product ${id} with JSON data:`, data)
      res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    }
    if (!res.ok) {
      const errorText = await res.text()
      console.error(`API Error (${res.status}):`, errorText)
      throw new Error(`API Error ${res.status}: ${errorText}`)
    }
    const result = await res.json()
    console.log('API: Product updated:', result)
    return result
  } catch (err) {
    console.error('updateProduct error:', err)
    throw err
  }
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete product')
  return res.json()
}

// Admin endpoints
export async function fetchAdmins() {
  const res = await fetch(`${API_BASE}/admins`)
  if (!res.ok) throw new Error('Failed to fetch admins')
  return res.json()
}

export async function createAdmin(data: any) {
  const res = await fetch(`${API_BASE}/admins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create admin')
  return res.json()
}
