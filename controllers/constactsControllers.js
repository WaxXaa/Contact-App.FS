const routes = require('express').Router()
const ContactDB = require('../models/ContactDb')
const User = require('../models/UserDb')
const { tokenMiddleware } = require('../utils/middelware')

routes.get('/', tokenMiddleware, (req, res, next) => {
  ContactDB.find({}).then(resp => {
    if (resp) {
      res.json(resp)
    } else {
      res.status(404).end()
    }
  })
    .catch(err => next(err))
})
routes.post('/', tokenMiddleware, async (req, res, next) => {
  const { body } = req
  const { name, number, userId } = body
  const user = User.findById(userId)
  const newContact = new ContactDB(
    {
      name,
      number,
      date: new Date(),
      user: user._id
    })
  const saveC = newContact.save()
    .then(resp => resp).catch((err) => next(err))
  user.contacts = user.contacts.concat(saveC._id)
  User.save()
    .then(() => {
      console.log('-------------------------------------------------------------------------------------\n\tan item has been created')
      res.json(saveC)
    }).catch(err => next(err))
})
routes.delete('/:id', (req, res, next) => {
  ContactDB.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
      console.log('-------------------------------------------------------------------------------------\n\tan item has been deleted')
    })
    .catch(err => next(err))
})
module.exports = routes
