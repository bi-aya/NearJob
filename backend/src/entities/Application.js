const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'Application',
  tableName: 'applications',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    // Message de motivation du candidat (optionnel)
    message: {
      type: 'text',
      nullable: true,
    },
    // Statut de la candidature
    status: {
      type: 'enum',
      enum: ['pending', 'viewed', 'accepted', 'rejected'],
      default: 'pending',
    },
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
    // Le freelance qui postule
    applicant: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'applicant_id' },
      nullable: false,
      eager: true,
    },
    // L'offre concernée
    job: {
      type: 'many-to-one',
      target: 'Job',
      joinColumn: { name: 'job_id' },
      nullable: false,
      eager: true,
    },
  },
})