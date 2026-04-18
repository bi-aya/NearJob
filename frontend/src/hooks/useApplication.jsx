import { useState, useCallback } from 'react'
import { 
  applyToJobApi,
  getMyApplicationsApi, 
  getReceivedApplicationsApi,
  withdrawApplicationApi ,
  updateApplicationStatusApi
} from '../apis/applicationApi'

export const useApplication = () => {
  const [myApps, setMyApps]             = useState([])
  const [receivedApps, setReceivedApps] = useState([])
  const [loading, setLoading]           = useState(false)

  const fetchMyApps = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getMyApplicationsApi()
      setMyApps(res.data)
    } finally { setLoading(false) }
  }, [])

  const fetchReceivedApplications = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getReceivedApplicationsApi()
      setReceivedApps(res.data)
    } finally { setLoading(false) }
  }, [])

  const apply = useCallback(async (jobId, message) => {
    setLoading(true)
    try {
      await applyToJobApi(jobId, message)
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Erreur lors de la candidature' 
      }
    } finally { setLoading(false) }
  }, [])

  const withdraw = useCallback(async (id) => {
    setLoading(true)
    try {
      await withdrawApplicationApi(id)
      setMyApps(prev => prev.filter(a => a.id !== id))
      return { success: true }
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.message || 'Impossible de retirer la candidature')
      return { success: false }
    } finally { setLoading(false) }
  }, [])
  const updateStatus = useCallback(async (id, status) => {
    try {
      await updateApplicationStatusApi(id, status)
      setReceivedApps(prev =>
        prev.map(a => a.id === id ? { ...a, status } : a)
      )
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.message || 'Impossible de mettre à jour')
    }
  }, [])
  return {
    myApps, receivedApps, loading,
    fetchMyApps, fetchReceivedApplications, apply, withdraw,updateStatus 
  }
}