const routes = require('express').Router()
const User = require('../models/UserDb')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
routes.post('/register', async (req, res, next) => {
  const { userName, name, password } = req.body
  if (!password) {
    console.log('password missing')
    return res.status(400).json({ error: 'password missing' })
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new User({
      userName,
      name,
      passwordHash,
      date: new Date()
    })
    const userSave = await newUser.save()
    console.log('-------------------------------------------------------------------------------------\n\tan item has been created')
    res.json(userSave)
  } catch (err) {
    next(err)
  }
})
routes.post('/login', async (req, res, next) => {
  const { body } = req
  const user = await User.findOne({ userName: body.userName })
  try {
    const correctPassword = !user ? false : await bcrypt.compare(body.password, user.passwordHash)
    if (!user) {
      return res.status(401).json({ error: 'invalid credencials' })
    } else if (!correctPassword) {
      return res.status(401).json({ error: 'invalid credencials' })
    }
    const userCredentials = {
      userName: user.userName,
      name: user.name,
      id: user._id
    }
    const token = jwt.sign(userCredentials, process.env.SECRET)
    res.json({ ...userCredentials, token })
    console.log({ ...userCredentials, token })
  } catch (err) { next(err) }
})
module.exports = routes
