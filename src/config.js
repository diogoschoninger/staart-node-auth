import dotenv from 'dotenv'
const imutable = Object.freeze

dotenv.config()

const database = imutable({
  client: 'mysql2',
  connection: imutable({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }),
  migrations: imutable({
    tableName: 'migrations',
  })
})

export default database
