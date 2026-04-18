import api from './authApi'

export const getProfileApi       = ()               => api.get('/users/me')
export const updateProfileApi    = (data)            => api.put('/users/me', data)
export const toggleAvailabilityApi = ()              => api.patch('/users/me/availability')
export const updateLocationApi   = (lat, lng)        => api.patch('/users/me/location', { latitude: lat, longitude: lng })
export const updateSkillsApi = (competenceIds)       =>  api.put('users/me/skills', { competenceIds });
export const addExperienceApi    = (data)            => api.post('/users/me/experiences', data)
export const deleteExperienceApi = (id)              => api.delete(`/users/me/experiences/${id}`)
export const updatePushTokenApi  = (pushToken)       => api.patch('/users/me/push-token', { pushToken })
