const mongoose = require('mongoose')
const url = process.env.MONGO_URL
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('database connected')
  })
  .catch(error => {
    console.log(error)
  })
const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: String
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('ContactList', contactSchema)
