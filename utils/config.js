require('dotenv').config()
const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL_CONTACTS
const SECRET = process.env.SECRET
module.exports = { PORT, MONGO_URL, SECRET }
