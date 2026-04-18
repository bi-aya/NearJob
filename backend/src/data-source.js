const { DataSource } = require('typeorm')
require('dotenv').config()
 
const AppDataSource = new DataSource({
  type: 'postgres',
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASS     || 'password',
  database: process.env.DB_NAME     || 'nearjob',
  synchronize: true,          // En dev uniquement — crée les tables auto
  logging: false,
  entities: [
    require('./entities/User'),
    require('./entities/Experience'),
    require('./entities/Job'),
    require('./entities/Competence'),
    require('./entities/Application'),
  ],
})
 
module.exports = { AppDataSource }