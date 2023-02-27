require('dotenv').config()
const { json } = require('express')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const middleware = require('./utils/middelware')
const cors = require('cors')
const { MONGO_URL } = require('./utils/config')
const contactsRoutes = require('./controllers/constactsControllers')
const usersRouters = require('./controllers/userControllers')
mongoose.set('strictQuery', false)
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('database connected')
  })
  .catch(error => {
    console.log(error)
  })

app.use(cors())
app.use(express.static('build'))
app.use(json())
app.use(middleware.requestLogger)

app.get('/', (req, res) => {
  res.send('../build/index.html')
})
app.use('/', usersRouters)
app.use('/notes', contactsRoutes)
app.use(middleware.unknowEndPoint)
app.use(middleware.errorHandler)
module.exports = app
