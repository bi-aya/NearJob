const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'Experience',
  tableName: 'experiences',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    title: {
      type: 'varchar',
      nullable: false,
    },
    company: {
      type: 'varchar',
      nullable: false,
    },
    startDate: {
      type: 'varchar',   // ex: "2021"
      nullable: false,
    },
    endDate: {
      type: 'varchar',   // ex: "2023" ou null = Présent
      nullable: true,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'experiences',
      joinColumn: { name: 'user_id' },
      onDelete: 'CASCADE',
    },
  },
})
