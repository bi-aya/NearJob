import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import jobsReducer from './jobSlice'
import profileReducer from './profileSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    profile: profileReducer,
  },
})