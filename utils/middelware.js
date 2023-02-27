const logger = require('./logger')
const jwt = require('jsonwebtoken')
const requestLogger = (req, res, next) => {
  logger.info('--------------------------------')
  logger.info('method', req.method)
  logger.info('path', req.path)
  logger.info('body', req.body)
  logger.info('--------------------------------')
  next()
}
const unknowEndPoint = (req, res) => {
  res.status(404).send({
    err: 'not found'
  })
}
const errorHandler = (err, req, res, next) => {
  logger.info(err.message, err.name)
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  logger.info(err.message)
  next(err)
}
const tokenMiddleware = async (req, res, next) => {
  const getToken = () => {
    const aut = req.get('authorization')
    if (aut && aut.toLowerCase().startsWith('bearer ')) {
      return aut.substring(7)
    }
    return null
  }
  const token = getToken()
  if (!token) {
    return res.status(401).json({ error: "invalid token'" })
  }
  const decodeT = jwt.verify(token, process.env.SECRET)
  if (!decodeT) {
    return res.status(401).json({ error: 'invalid token' })
  } else {
    next()
  }
}
module.exports = {
  tokenMiddleware,
  requestLogger,
  unknowEndPoint,
  errorHandler
}
