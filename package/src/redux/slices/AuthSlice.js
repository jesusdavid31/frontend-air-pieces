import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: '',
    rememberMe: false,
    emailSaved: '',
    password: '',
    role: ''
};

export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        onLogin: (state, action) => {
            state.token = action.payload.token;
            state.role = action.payload.role?.code;
        },

        onRememberMe: (state, action) => {
            state.rememberMe = action.payload.rememberMe;
            state.emailSaved = action.payload.email;
            state.password = action.payload.password;
        },
        
        onLogout: (state) => {
            if(!state.rememberMe){
                return initialState;
            }else{
                state.token = '';
            }
        },
    },
});

// Action creators are generated for each case reducer function
export const { onLogin, onLogout, onRememberMe } = AuthSlice.actions;