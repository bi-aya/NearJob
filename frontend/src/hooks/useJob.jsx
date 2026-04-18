import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from './useAuth'
import { 
  fetchMyJobsThunk, 
  fetchJobsThunk, 
  createJobThunk, 
  deleteJobThunk, 
  resetJob 
} from '../Redux/jobSlice'

export const useJob = () => {
  const dispatch = useDispatch()
  const { jobs, myJobs, loading, error, success } = useSelector((s) => s.jobs)
  const { isRecruteur } = useAuth()

  const fetchMyJobs = () => dispatch(fetchMyJobsThunk())
  const publishJob  = (data) => dispatch(createJobThunk(data))
  const fetchJobs   = () => dispatch(fetchJobsThunk())
  const deleteJob   = (id) => dispatch(deleteJobThunk(id))
  const resetStatus = () => dispatch(resetJob())
  const updateJob = (id, data) => dispatch(updateJobThunk({ id, data }))

  return {
    jobs, myJobs, loading, error, success, isRecruteur,
    fetchMyJobs, publishJob, fetchJobs, deleteJob, resetStatus,updateJob
  }
}