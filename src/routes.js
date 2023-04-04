import { Router } from 'express'

import user from './controller.js'
import validate from './middlewares/validate.js'
import schemas from './utils/schemas.js'

const router = Router()

router
  .post('/', validate(schemas.create), user.create)
  .get('/', user.list)
  .get('/:id', validate(schemas.get), user.get)
  .put('/:id', validate(schemas.update), user.update)
  .delete('/:id', validate(schemas.delete), user.delete)

export default router
