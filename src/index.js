const { json } = require('express')
const express = require('express')
const cors = require('cors')
const app = express()
let contacts = [
    {
        name: "ale",
        number: "423-234-2",
        id: 1
    }
]
app.use(cors())

app.use(express.json())

const idGenerator = () => {
    const maxId = contacts.length > 0
    ? Math.max(...contacts.map((c) => c.id))
    : 0
    return maxId
}
app.get('/', (req, res) => {
    res.send('hello world alejandro')
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
    res.json(contacts)
    console.table(contacts)
})
app.post('/notes', (req, res) => {
    const {body} = req
    const find = contacts.find(c => c.name === body.name && c.number === body.number)
    if(!body.name && !body.number) {
        return res.status(400).json({error: "content missing"})
    }
    else if(find) {
        return res.status(400).json({error: "content repeat"})
    }
    const {name, number} = body
    const contact = {name, number}
    contact.id = idGenerator() + 1
    contacts.push(contact)
    res.json(contact)
    console.log("-------------------------------------------------------------------------------------\n\tan item has been created")
    console.table(contact)
})
app.delete('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id)
    contacts = contacts.filter(c => c.id !== id)
    res.end()
    console.log("-------------------------------------------------------------------------------------\n\tan item has been deleted")
    console.table(contacts)
})

app.listen(3002)
console.log('runing')