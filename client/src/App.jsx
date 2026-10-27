import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || ''

const emptyMenuForm = {
  name: '',
  category: '',
  price: '',
  description: '',
  is_available: true,
}

const emptyOrderForm = {
  customer_name: '',
  phone: '',
  address: '',
  total_amount: '',
}

function App() {
  const [menu, setMenu] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(emptyMenuForm)
  const [orderForm, setOrderForm] = useState(emptyOrderForm)
  const [editingId, setEditingId] = useState(null)

  const fetchMenu = async () => {
    const res = await fetch(`${API_URL}/api/menu`)
    const data = await res.json()
    setMenu(data)
  }

  const fetchOrders = async () => {
    const res = await fetch(`${API_URL}/api/orders`)
    const data = await res.json()
    setOrders(data)
  }

  useEffect(() => {
    fetchMenu()
    fetchOrders()
  }, [])

  const handleMenuChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleOrderChange = (e) => {
    const { name, value } = e.target
    setOrderForm({
      ...orderForm,
      [name]: value,
    })
  }

  const handleMenuSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...form,
      price: Number(form.price),
    }

    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `${API_URL}/api/menu/${editingId}` : `${API_URL}/api/menu`

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setForm(emptyMenuForm)
      setEditingId(null)
      fetchMenu()
    }
  }

  const handleOrderSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...orderForm,
      total_amount: Number(orderForm.total_amount),
    }

    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setOrderForm(emptyOrderForm)
      fetchOrders()
    }
  }

  const handleEdit = (dish) => {
    setEditingId(dish.id)
    setForm({
      name: dish.name,
      category: dish.category,
      price: dish.price,
      description: dish.description,
      is_available: dish.is_available,
    })
  }

  const handleDelete = async (id) => {
    const res = await fetch(`${API_URL}/api/menu/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchMenu()
    }
  }

  const updateOrderStatus = async (id, status) => {
    const res = await fetch(`${API_URL}/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (res.ok) {
      fetchOrders()
    }
  }

  return (
    <div className="container">
      <header className="topbar">
        <div>
          <p className="eyebrow">Online Food Ordering</p>
          <h1>Chef Cart Admin</h1>
        </div>
        <div className="stats">
          <div className="stat-box">
            <span>{menu.length}</span>
            <small>Menu items</small>
          </div>
          <div className="stat-box">
            <span>{orders.length}</span>
            <small>Orders</small>
          </div>
        </div>
      </header>

      <div className="section">
        <h3>{editingId ? 'Edit Dish' : 'Add New Dish'}</h3>
        <form onSubmit={handleMenuSubmit} className="form">
          <input name="name" value={form.name} placeholder="Dish name" onChange={handleMenuChange} required />
          <input name="category" value={form.category} placeholder="Category" onChange={handleMenuChange} required />
          <input name="price" type="number" step="0.01" value={form.price} placeholder="Price" onChange={handleMenuChange} required />
          <textarea name="description" value={form.description} placeholder="Description" onChange={handleMenuChange} />
          <label className="checkbox-row">
            <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleMenuChange} />
            Available
          </label>
          <div className="button-row">
            <button type="submit">{editingId ? 'Update Dish' : 'Add Dish'}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => {
                setEditingId(null)
                setForm(emptyMenuForm)
              }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="section">
        <h3>Menu</h3>
        {menu.length === 0 ? <p>No food items yet.</p> : menu.map((dish) => (
          <div key={dish.id} className="card">
            <div>
              <strong>{dish.name}</strong>
              <p>{dish.category}</p>
              <p>Price: ₹{dish.price}</p>
              <p>{dish.description}</p>
              <p>Status: {dish.is_available ? 'Available' : 'Not available'}</p>
            </div>
            <div className="actions">
              <button type="button" onClick={() => handleEdit(dish)}>Edit</button>
              <button type="button" className="danger" onClick={() => handleDelete(dish.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <h3>Place New Order</h3>
        <form onSubmit={handleOrderSubmit} className="form order-form">
          <input name="customer_name" value={orderForm.customer_name} placeholder="Customer name" onChange={handleOrderChange} required />
          <input name="phone" value={orderForm.phone} placeholder="Phone number" onChange={handleOrderChange} required />
          <input name="address" value={orderForm.address} placeholder="Delivery address" onChange={handleOrderChange} required />
          <input name="total_amount" type="number" step="0.01" value={orderForm.total_amount} placeholder="Total amount" onChange={handleOrderChange} required />
          <button type="submit">Create Order</button>
        </form>
      </div>

      <div className="section">
        <h3>Orders</h3>
        {orders.length === 0 ? <p>No orders yet.</p> : orders.map((order) => (
          <div key={order.id} className="card order-card">
            <p><strong>Order:</strong> #{order.id}</p>
            <p><strong>Customer:</strong> {order.customer_name}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Total:</strong> ₹{order.total_amount}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <div className="status-actions">
              <button type="button" onClick={() => updateOrderStatus(order.id, 'Pending')}>Pending</button>
              <button type="button" onClick={() => updateOrderStatus(order.id, 'Preparing')}>Preparing</button>
              <button type="button" onClick={() => updateOrderStatus(order.id, 'Ready')}>Ready</button>
              <button type="button" onClick={() => updateOrderStatus(order.id, 'Delivered')}>Delivered</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
