const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const clientBuildPath = path.join(__dirname, '../client/dist')

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath))
}

let menu = [
  { id: 1, name: 'Burger', category: 'Fast Food', price: 120, description: 'Classic burger', is_available: true },
  { id: 2, name: 'Pizza', category: 'Italian', price: 220, description: 'Cheese pizza', is_available: true },
  { id: 3, name: 'Pasta', category: 'Italian', price: 180, description: 'Creamy pasta', is_available: false },
]

let orders = [
  { id: 1, customer_name: 'Aman', phone: '9876543210', address: 'Delhi', total_amount: 340, status: 'Pending' },
  { id: 2, customer_name: 'Riya', phone: '9123456780', address: 'Mumbai', total_amount: 220, status: 'Preparing' },
]

let nextMenuId = 4
let nextOrderId = 3

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/menu', (req, res) => {
  res.json(menu)
})

app.post('/api/menu', (req, res) => {
  const { name, category, price, description, is_available } = req.body

  const item = {
    id: nextMenuId++,
    name,
    category,
    price,
    description,
    is_available: is_available !== false,
  }

  menu.push(item)
  res.status(201).json(item)
})

app.put('/api/menu/:id', (req, res) => {
  const id = Number(req.params.id)
  const item = menu.find((dish) => dish.id === id)

  if (!item) {
    return res.status(404).json({ message: 'Dish not found' })
  }

  Object.assign(item, req.body, { id, price: Number(req.body.price) })
  res.json(item)
})

app.delete('/api/menu/:id', (req, res) => {
  const id = Number(req.params.id)
  menu = menu.filter((dish) => dish.id !== id)
  res.json({ message: 'Dish deleted' })
})

app.get('/api/orders', (req, res) => {
  res.json(orders)
})

app.post('/api/orders', (req, res) => {
  const { customer_name, phone, address, total_amount } = req.body

  const order = {
    id: nextOrderId++,
    customer_name,
    phone,
    address,
    total_amount,
    status: 'Pending',
  }

  orders.unshift(order)
  res.status(201).json(order)
})

app.patch('/api/orders/:id', (req, res) => {
  const id = Number(req.params.id)
  const order = orders.find((item) => item.id === id)

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  order.status = req.body.status
  res.json(order)
})

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath))

  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'))
  })
}

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
