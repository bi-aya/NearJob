import api from './authApi'

// ─── Freelance ────────────────────────────────────────────────────────

// Postuler à une offre
export const applyToJobApi = (jobId, message) =>
  api.post('/applications', { jobId, message })

// Mes candidatures envoyées
export const getMyApplicationsApi = () =>
  api.get('/applications/me')

// Retirer une candidature
export const withdrawApplicationApi = (id) =>
  api.delete(`/applications/${id}`)

// ─── Recruteur ────────────────────────────────────────────────────────

// Toutes les candidatures reçues
export const getReceivedApplicationsApi = () =>
  api.get('/applications/received')

// Candidatures pour un job précis
export const getApplicationsForJobApi = (jobId) =>
  api.get(`/applications/job/${jobId}`)

// Changer le statut d'une candidature
export const updateApplicationStatusApi = (id, status) =>
  api.patch(`/applications/${id}/status`, { status })