import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../api/client";

const AUTH_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

// Shared refresh flow: exchanges the httpOnly cookie for a new access token.
let refreshPromise = null;
export const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${AUTH_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true })
      .then((res) => {
        const { token, id, _id, role } = res.data;
        const userData = { token, id: id ?? _id, _id: _id ?? id, role };
        localStorage.setItem("userData", JSON.stringify(userData));
        return userData;
      })
      .finally(() => {
        refreshPromise = null; // allow later retries after failure
      });
  }
  return refreshPromise;
};

// LOGOUT (server-side session revocation; local state cleared by the slice)
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      await axios.post(
        `${AUTH_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {
      // Even if the server call fails we clear local state below.
    }
    dispatch(logout());
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/login", {
        email,
        password,
        role,
      });
      const { token, id, _id, role: userRole } = response.data;
      const userData = { token, id: id ?? _id, _id: _id ?? id, role: userRole };
      localStorage.setItem("userData", JSON.stringify(userData));
      return { success: true, ...userData };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  }
);

// REGISTER DOCTOR
export const registerDoctor = createAsyncThunk(
  "auth/registerDoctor",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/doctors/add", formData);
      return { success: true, data: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Doctor registration failed."
      );
    }
  }
);

// REGISTER PATIENT
export const registerPatient = createAsyncThunk(
  "auth/registerPatient",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/patient/add", formData);
      return { success: true, data: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Patient registration failed."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Safe parse: corrupt storage must not crash the app at boot.
    user: (() => {
      try {
        return JSON.parse(localStorage.getItem("userData"));
      } catch {
        localStorage.removeItem("userData");
        return null;
      }
    })(),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userData");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //   REGISTER DOCTOR
      .addCase(registerDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerDoctor.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // REGISTER PATIENT
      .addCase(registerPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerPatient.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
