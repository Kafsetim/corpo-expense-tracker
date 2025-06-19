// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

// Custom route for pending expenses
server.get('/api/expenses/pending', (req, res) => {
  const db = router.db
  const pending = db.get('expenses').filter({ status: 'pending' }).value()
  res.json(pending)
})

// Custom route for status updates
server.patch('/api/expenses/:id/status', (req, res) => {
  const db = router.db
  db.get('expenses')
    .find({ id: req.params.id })
    .assign(req.body)
    .write()
  res.status(204).send()
})

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running on port 3000')
})
