import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { 
  getProfileApi, updateProfileApi, updateSkillsApi, 
  addExperienceApi, toggleAvailabilityApi, updateLocationApi
} from '../apis/usersApi'

export const fetchProfileThunk = createAsyncThunk('profile/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await getProfileApi()
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const updateProfileThunk = createAsyncThunk('profile/update', async (data, { rejectWithValue }) => {
  try {
    const res = await updateProfileApi(data)
    console.log("Réponse updateProfile :", res.data)
    return res.data
  } catch (err) {
    console.error("Erreur updateProfile :", err.response?.data)
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const updateSkillsThunk = createAsyncThunk('profile/updateSkills', async (skills, { rejectWithValue }) => {
  try {
    const res = await updateSkillsApi(skills)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const addExperienceThunk = createAsyncThunk('profile/addExperience', async (data, { rejectWithValue }) => {
  try {
    const res = await addExperienceApi(data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const toggleAvailabilityThunk = createAsyncThunk('profile/toggleDispo', async (_, { rejectWithValue }) => {
  try {
    const res = await toggleAvailabilityApi()
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const updateLocationThunk = createAsyncThunk('profile/updateLocation', async ({ latitude, longitude }, { rejectWithValue }) => {
  try {
    const res = await updateLocationApi(latitude, longitude)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur')
  }
})

export const updateLocation = createAsyncThunk(
  'profile/updateLocation',
  async ({ latitude, longitude }) => {
    const res = await updateLocationApi(latitude, longitude)
    return res.data // { latitude, longitude }
  },
)
const profileSlice = createSlice({
  name: 'profile',
  initialState: { data: null, loading: false, saving: false, error: null },
  reducers: {
    clearProfileError: (state) => { state.error = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileThunk.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => { state.loading = false; state.data = action.payload })
      .addCase(fetchProfileThunk.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(updateProfileThunk.pending,   (state) => { state.saving = true })
      .addCase(updateProfileThunk.fulfilled, (state, action) => { state.saving = false; state.data = { ...state.data, ...action.payload } })
      .addCase(updateProfileThunk.rejected,  (state) => { state.saving = false })

      .addCase(updateSkillsThunk.fulfilled, (state, action) => {
        if (state.data) state.data.competences = action.payload?.competences || []
      })

      .addCase(addExperienceThunk.fulfilled, (state, action) => {
        if (state.data) state.data.experiences = [action.payload, ...(state.data.experiences || [])]
      })

      .addCase(toggleAvailabilityThunk.fulfilled, (state, action) => {
        if (state.data) state.data.isAvailable = action.payload.isAvailable
      })

      .addCase(updateLocationThunk.fulfilled, (state, action) => {
        if (state.data) {
          state.data.latitude  = action.payload.latitude
          state.data.longitude = action.payload.longitude
        }
      })
  }
})

export const { clearProfileError } = profileSlice.actions
export default profileSlice.reducer