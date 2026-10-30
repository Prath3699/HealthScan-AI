// Single source of truth for auth state: the `auth` slice (redux/authSlice.js).
// These selectors used to read a stale, never-updated copy inside rootSlice;
// they now point at the live slice so components and guards stay in sync.
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
