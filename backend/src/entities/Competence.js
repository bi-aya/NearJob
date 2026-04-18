const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'Competence',
  tableName: 'competences',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: 'increment',  // SERIAL en PostgreSQL
    },
    name: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
  },
  relations: {
    users: {
      type: 'many-to-many',
      target: 'User',
      inverseSide: 'competences',
    },
  },
})