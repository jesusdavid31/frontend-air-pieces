import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: '',
    // charging: false,
    rememberMe: false,
    emailSaved: '',
    password: ''
};

export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        onLogin: (state, action) => {
            state.token = action.payload.token;
        },

        onRememberMe: (state, action) => {
            state.rememberMe = action.payload.rememberMe;
            state.emailSaved = action.payload.email;
            state.password = action.payload.password;
        },

        onLogout: () => initialState,
    },
});

// Action creators are generated for each case reducer function
export const { onLogin, onLogout, onRememberMe } = AuthSlice.actions;