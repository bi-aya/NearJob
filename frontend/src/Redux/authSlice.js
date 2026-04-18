import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi, getMeApi } from '../apis/authApi';
import * as SecureStore from 'expo-secure-store';
import registerForPushNotificationsAsync from '../../Notification/notification'
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginApi(credentials);

      const { user, accessToken, refreshToken } = res.data;

      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
         // Après le login, tu as accès à l'userId
  
      
  
      return { user, accessToken };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Erreur connexion'
      );
    }
  }
);

export const restoreSessionThunk = createAsyncThunk('auth/restore', async (_, { rejectWithValue }) => {
  try {
    const token = await SecureStore.getItemAsync('accessToken');
    if (!token) return rejectWithValue('No token');
    const res = await getMeApi();
    return { user: res.data, accessToken: token };
  } catch (err) { return rejectWithValue('Session expirée'); }
});

export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ email, password, role, firstName, lastName }, { rejectWithValue }) => {
    try {
      const res = await registerApi({ email, password, role, firstName, lastName });

      const { user, accessToken, refreshToken } = res.data;

      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);

      return { user, accessToken };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erreur lors de l'inscription"
      );
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null, loading: false, error: null, isRestoring: true },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      SecureStore.deleteItemAsync('accessToken');
    },
    clearError: (state) => { state.error = null; },

   
  },
extraReducers: (builder) => {
  builder
    // LOGIN
    .addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    })
    .addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // REGISTER
    .addCase(registerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(registerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    })
    .addCase(registerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // RESTORE
    .addCase(restoreSessionThunk.pending, (state) => {
      state.isRestoring = true;
    })
    .addCase(restoreSessionThunk.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isRestoring = false;
    })
    .addCase(restoreSessionThunk.rejected, (state) => {
      state.isRestoring = false;
    });
}
});

export const { logout,clearError } = authSlice.actions;
export default authSlice.reducer;