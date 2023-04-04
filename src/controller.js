import asyncErrorHandler from './middlewares/async-error.js'
import UsersRepository from './repository/sql-repository.js'
import encrypt from './utils/encrypt.js'

const repository = UsersRepository()

const user = {
  create: asyncErrorHandler(async (req, res) => {
    const user = {
      ...req.body,
      password: await encrypt(req.body.password)
    }

    const { password, ...inserted } = await repository.insert(user)

    res.status(201)
      .header('Location', `/api/users/${inserted.id}`)
      .send(inserted)
  }),

  list: asyncErrorHandler(async (_req, res) => {
    const users = await repository.list()
    
    res.status(200).send(users)
  }),

  get: asyncErrorHandler(async (req, res) => {
    const id = parseInt(req.params.id)
  
    const user = await repository.get(id)
  
    res.status(200).send(user)
  }),

  update: asyncErrorHandler(async (req, res) => {
    const id = parseInt(req.params.id)
  
    const body = req.body
  
    const registered = await repository.get(id)
  
    const user = { ...registered, ...body, id }
  
    const updated = await repository.update(user)
  
    res.status(200).send(updated)
  }),

  delete: asyncErrorHandler(async (req, res) => {
    const id = parseInt(req.params.id)
  
    await repository.get(id)
  
    await repository.del(id)
    
    res.status(204).send()
  })
}

export default user
