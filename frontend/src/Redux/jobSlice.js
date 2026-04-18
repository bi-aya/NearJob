import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getJobsApi, getMyJobsApi, createJobApi, deleteJobApi } from '../apis/jobApi'

// ─── THUNKS OBLIGATOIRES ──────────────────────────────────────────────
export const fetchJobsThunk = createAsyncThunk('jobs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await getJobsApi()
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur API')
  }
})

export const fetchMyJobsThunk = createAsyncThunk('jobs/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await getMyJobsApi()
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur API')
  }
})

export const createJobThunk = createAsyncThunk('jobs/create', async (data, { rejectWithValue }) => {
  try {
    const res = await createJobApi(data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur API')
  }
})

export const deleteJobThunk = createAsyncThunk('jobs/delete', async (id, { rejectWithValue }) => {
  try {
    await deleteJobApi(id)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur API')
  }
})

export const updateJobThunk = createAsyncThunk('jobs/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updateJobApi(id, data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

// ─── SLICE ────────────────────────────────────────────────────────────
const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    myJobs: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetJob: (state) => { state.error = null; state.success = false },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Jobs
      .addCase(fetchMyJobsThunk.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchMyJobsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.myJobs = action.payload
      })
      .addCase(fetchMyJobsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch All Jobs
      .addCase(fetchJobsThunk.fulfilled, (state, action) => {
        state.jobs = action.payload
      })

      // Create Job
      .addCase(createJobThunk.pending, (state) => { state.loading = true })
      .addCase(createJobThunk.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.myJobs = [action.payload, ...state.myJobs]
        state.jobs = [action.payload, ...state.jobs]
      })

      // Delete Job
      .addCase(deleteJobThunk.fulfilled, (state, action) => {
        state.myJobs = state.myJobs.filter(j => j.id !== action.payload)
        state.jobs = state.jobs.filter(j => j.id !== action.payload)
      })

      .addCase(updateJobThunk.fulfilled, (state, action) => {
        state.myJobs = state.myJobs.map(j => j.id === action.payload.id ? action.payload : j)
      })
  },
})

export const { resetJob } = jobSlice.actions
export default jobSlice.reducer