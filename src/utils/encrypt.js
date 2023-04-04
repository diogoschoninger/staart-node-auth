import { createHash } from 'crypto'

const encrypt = async data =>
  createHash('sha256').update(data).digest('hex')

export default encrypt
