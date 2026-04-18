const { AppDataSource } = require('../data-source')
const { Not, IsNull } = require('typeorm')

const sendPushToAllUsers = async (title, body, data = {}) => {
  try {
    const userRepo = AppDataSource.getRepository('User')

    const users = await userRepo.find({
      where: { pushToken: Not(IsNull()) },
      select: ['id', 'pushToken'],
    })

    if (!users.length) return

    const tokens = users.map(u => u.pushToken).filter(Boolean)

    const chunks = []
    for (let i = 0; i < tokens.length; i += 100) {
      chunks.push(tokens.slice(i, i + 100))
    }

    for (const chunk of chunks) {
      const messages = chunk.map(token => ({
        to: token,
        sound: 'default',
        title,
        body,
        data,
      }))

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(messages),
      })

      const result = await response.json()

      // 🔥 gestion erreurs token
      result.data?.forEach((res, index) => {
        if (res.status === 'error') {
          console.log('Token invalide:', chunk[index])
          // 👉 ici tu peux supprimer le token de la DB
        }
      })

      console.log('Batch envoyé')
    }
  } catch (err) {
    console.error('Erreur push:', err.message)
  }
}

module.exports = { sendPushToAllUsers }