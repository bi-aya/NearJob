import { useDispatch, useSelector } from 'react-redux'
import { loginThunk, restoreSessionThunk, logout, clearError,registerThunk } from '../Redux/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, accessToken, loading, error, isRestoring } = useSelector((s) => s.auth)

  const login = (email, password) => dispatch(loginThunk({ email, password }))
  const handleLogout = () => dispatch(logout())
  const restoreSession = () => dispatch(restoreSessionThunk())
  const resetError = () => dispatch(clearError())
  const register = (data) => dispatch(registerThunk(data))
  const isLoggedIn   = !!user
  const isFreelance  = user?.role === 'freelance'
  const isRecruteur  = user?.role === 'recruiter'
  const userInitials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'NJ'

  return {
    user, accessToken, loading, error, isRestoring,
    isLoggedIn, isFreelance, isRecruteur, userInitials,
    login, logout: handleLogout, restoreSession, 
    resetError, register,
    
  }
}