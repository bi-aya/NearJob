const express      = require('express')
const cors         = require('cors')
const helmet       = require('helmet')
const morgan       = require('morgan')
const http         = require('http')
const { Server }   = require('socket.io')
require('dotenv').config()
require('reflect-metadata')

const { sendPushNotification } = require('./src/services/push.service')

 
const { AppDataSource }  = require('./src/data-source')
const authRoutes          = require('./src/routes/auth.routes')
 const usersRoutes = require('./src/routes/users.routes')
 const jobsRoutes = require('./src/routes/job.routes')
const Competence = require('./src/entities/Competence')
const CompetenceRoutes = require('./src/routes/competence.routes')
const applicationRoutes = require('./src/routes/application.routes')
const app    = express()
const server = http.createServer(app)
const io     = new Server(server, {
  cors: { origin: '*' },
})
const userRepo = () => AppDataSource.getRepository('User')
// ── Middlewares globaux ───────────────────────────────────────────────
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())


// ── Routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
// app.use('/api/users', usersRoutes)    ← à venir
app.use('/api/jobs',  jobsRoutes)   

app.use(express.json());
app.use('/api/skills',  CompetenceRoutes)   
 app.use('/api/applications', applicationRoutes)
// ── Socket.io ─────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('Client connecté :', socket.id)
  socket.on('disconnect', () => {
    console.log('Client déconnecté :', socket.id)
  })
})
// ── Démarrage ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000


AppDataSource.initialize()
  .then(() => {
    console.log('PostgreSQL connecté via TypeORM')
    server.listen(PORT, () => {
      console.log(`NearJob API démarrée sur http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Erreur connexion DB :', err)
    process.exit(1)
  })

  ///////////////////////////////////////////////////////////////

  app.post('/api/save-token', async (req, res) => {
  const { token, userId } = req.body;

  try {
    // Sauvegarde en base de données
    // Exemple avec TypeORM (adapte à ton modèle User)
    await userRepo().update(
      { id: userId },
      { pushToken: token }
    );

    console.log(`Token sauvegardé pour user ${userId}:`, token);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
