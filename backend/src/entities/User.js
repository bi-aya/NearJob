const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    email: {
      type: 'varchar',
      unique: true,
      nullable: false,
    },
    passwordHash: {
      type: 'varchar',
      nullable: false,
    },
    role: {
      type: 'enum',
      enum: ['freelance', 'recruiter'],
      default: 'freelance',
    },
    // Profil
    firstName: {
      type: 'varchar',
      nullable: true,
    },
    lastName: {
      type: 'varchar',
      nullable: true,
    },
    avatar: {
      type: 'varchar',
      nullable: true,
    },
    bio: {
      type: 'text',
      nullable: true,
    },
    category: {
      type: 'varchar',
      nullable: true,         // ex: 'développeur', 'designer', 'photographe'
    },
    dailyRate: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: true,
    },
    city: {
      type: 'varchar',
      nullable: true,
    },
    // Géolocalisation (lat/lng simples — pas de PostGIS)
    latitude: {
      type: 'float',
      nullable: true,
    },
    longitude: {
      type: 'float',
      nullable: true,
    },
    isAvailable: {
      type: 'boolean',
      default: false,
    },
    // Notation
    avgRating: {
      type: 'float',
      default: 0,
    },
    reviewCount: {
      type: 'int',
      default: 0,
    },
    // Push notifications
    pushToken: {
      type: 'varchar',
      nullable: true,
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
    experiences: {
      type: 'one-to-many',
      target: 'Experience',
      inverseSide: 'user',
      eager: true,
    },

     competences: {
    type: 'many-to-many',
    target: 'Competence',  
    cascade: true,//PERMET DE SAUVER LA JONCTION AUTOMATIQUEMENT
    joinTable: {
      name: 'user_competences',      // ← table de jointure
      joinColumn: { name: 'user_id' },
      inverseJoinColumn: { name: 'competence_id' },
    },
    eager: true,
  },
  },
  
})

/*skills: {
      type: 'many-to-many',
      target: 'Skill',
      joinTable: {
        name: 'user_skills',
        joinColumn: { name: 'user_id' },
        inverseJoinColumn: { name: 'skill_id' },
      },
      eager: true,
    },
    jobs: {
      type: 'one-to-many',
      target: 'Job',
      inverseSide: 'recruiter',
    },
    conversations: {
      type: 'one-to-many',
      target: 'Conversation',
      inverseSide: 'freelance',
    },
    reviews: {
      type: 'one-to-many',
      target: 'Review',
      inverseSide: 'reviewed',
    },*/