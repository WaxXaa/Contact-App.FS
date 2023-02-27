const mongoose = require('mongoose')
const mongooseValidator = require('mongoose-unique-validator')

const usersSchema = mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  date: String,
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ontactList'
    }
  ]
})
usersSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})
mongoose.plugin(mongooseValidator)
module.exports = mongoose.model('User', usersSchema)
