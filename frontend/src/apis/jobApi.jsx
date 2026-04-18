import api from './authApi'  // ← instance avec token automatique

// ─── Public ───────────────────────────────────────────────────────────
export const getJobsApi    = ()     => api.get('/jobs')
export const getJobByIdApi = (id)   => api.get(`/jobs/${id}`)

// ─── Protégé ──────────────────────────────────────────────────────────
export const createJobApi  = (data) => api.post('/jobs', data)
export const getMyJobsApi = async () => {
  console.log("=== getMyJobsApi appelé ===")
  try {
    const res = await api.get('/jobs/my')
    console.log("=== résultat /jobs/my :", res.data)
    return res
  } catch (err) {
    console.log("=== erreur /jobs/my :", err.response?.status, err.response?.data)
    throw err
  }
}
export const deleteJobApi  = (id)   => api.delete(`/jobs/${id}`)
export const updateJobApi = (id, data) => api.put(`/jobs/${id}`, data)