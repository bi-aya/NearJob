const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'Job',
  tableName: 'jobs',
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
    description: {
      type: 'text',
      nullable: false,
    },
    // Catégorie / Type
    category: {
      type: 'varchar',
      nullable: false, // ex: 'Développement', 'Design', 'Marketing', 'Comptabilité', 'Autre'
    },
    type: {
      type: 'enum',
      enum: ['freelance', 'cdi_cdd', 'stage'],//'Stage','Freelance' ,'CDI / CDD'
      default: 'freelance',
    },
    // Budget / Salaire
    budget: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: true,
    },
    budgetType: {
      type: 'enum',
      enum: ['fixed', 'daily', 'monthly'],
      default: 'fixed', // fixe, journalier, mensuel
    },
    // Localisation GPS
    city: {
      type: 'varchar',
      nullable: true,
    },
    latitude: {
      type: 'float',
      nullable: true,
    },
    longitude: {
      type: 'float',
      nullable: true,
    },
    // Status
    status: {
      type: 'enum',
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
    // Timestamps
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    recruiter: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'recruiter_id' },
      nullable: false,
      eager: true, // charge le recruteur automatiquement
    },
  },
})