const imutable = Object.freeze

const database = imutable({
  client: 'mysql2',
  connection: imutable({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Ogoid@132',
    database: 'users'
  }),
  migrations: imutable({
    tableName: 'migrations',
  })
})

export default database
