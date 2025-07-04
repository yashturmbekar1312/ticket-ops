import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, AuthState, LoginFormData } from "../types";
import { authService } from "../services/auth";

// Safe localStorage access
const getStoredToken = (): string | null => {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  } catch (error) {
    console.warn('Failed to access localStorage:', error);
    return null;
  }
};

const setStoredToken = (token: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem("token", token);
    }
  } catch (error) {
    console.warn('Failed to set token in localStorage:', error);
  }
};

const removeStoredToken = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
    }
  } catch (error) {
    console.warn('Failed to remove token from localStorage:', error);
  }
};

const initialState: AuthState = {
  user: null,
  token: getStoredToken(),
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      setStoredToken(response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      removeStoredToken();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.token = null;
        removeStoredToken();
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
