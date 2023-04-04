import express from 'express'

import errorHandler from './middlewares/error.js'
import users from './routes.js'

const app = express()
const router = express.Router()

router.use(express.json())
router.use('/users', users)
router.use(errorHandler())

app.use('/api/v1', router)

app.use('*', (_req, res) =>
  res.status(400).send({ message: "Invalid endpoint" }))

app.listen(3333, () => console.log('Server started.'))
