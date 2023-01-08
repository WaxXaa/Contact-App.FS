require('dotenv').config()
const { json } = require('express')
const express = require('express')
const cors = require('cors')
const ContactDB = require('./mongoose')

const app = express()
const contacts = [
  {
    name: 'ale',
    number: '423-234-2',
    id: 1
  }
]
app.use(cors())
app.use(express.static('build'))
app.use(json())

app.get('/', (req, res) => {
  res.send('../build/index.html')
})
app.get('/info', (req, res) => {
  res.send(`you have ${contacts.length} contacts`)
})
app.get('/note/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const contact = contacts.find(note => note.id === id)
  res.json(contact)
})
app.get('/notes', (req, res) => {
  ContactDB.find({}).then(resp => {
    res.json(resp)
    console.table(resp)
  })
    .catch(err => console.log(err))
})
app.post('/notes', (req, res) => {
  const { body } = req
  const find = contacts.find(c => c.name === body.name && c.number === body.number)
  if (!body.name && !body.number) {
    return res.status(400).json({ error: 'content missing' })
  } else if (find) {
    return res.status(400).json({ error: 'content repeat' })
  }
  const { name, number } = body
  const newContact = new ContactDB({ name, number, date: new Date() })
  newContact.save().then(resp => {
    console.log('-------------------------------------------------------------------------------------\n\tan item has been created')
    res.json(resp)
  }).catch((err) => console.log(err))
})
app.delete('/notes/:id', (req, res) => {
  ContactDB.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
      console.log('-------------------------------------------------------------------------------------\n\tan item has been deleted')
    })
    .catch(err => console.log(err))
})
const PORT = process.env.PORT
app.listen(PORT)
console.log(`runing on port ${PORT}`)
