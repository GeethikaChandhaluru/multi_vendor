import { createSlice } from "@reduxjs/toolkit";

const loadAuthState = () => {
    try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const name = localStorage.getItem("name");
        const id = localStorage.getItem("userId");
        if (token && role) return { isAuthenticated: true, token, role, name, id };
    } catch (_) { }
    return { isAuthenticated: false, token: null, role: null, name: null, id: null };
};

const authSlice = createSlice({
    name: "auth",
    initialState: loadAuthState(),
    reducers: {
        setCredentials: (state, action) => {
            const { token, role, name, id } = action.payload;
            state.isAuthenticated = true;
            state.token = token;
            state.role = role;
            state.name = name;
            state.id = id;
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("name", name || "");
            localStorage.setItem("userId", id || "");
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.role = null;
            state.name = null;
            state.id = null;
            ["token", "role", "name", "userId"].forEach((k) => localStorage.removeItem(k));
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export const selectIsAuthenticated = (state) => state.auth?.isAuthenticated ?? false;
export const selectUserRole = (state) => state.auth?.role ?? null;
export const selectUserName = (state) => state.auth?.name ?? null;
export const selectToken = (state) => state.auth?.token ?? null;
export default authSlice.reducer;