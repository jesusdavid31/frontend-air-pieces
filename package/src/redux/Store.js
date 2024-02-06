import { configureStore } from "@reduxjs/toolkit";
// Imports for persist
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import { AuthSlice } from "./slices/AuthSlice";

const persistConfig = {
  key: "air-pieces",
  storage,
};

const rootReducer = combineReducers({
  auth: AuthSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // middleware: [thunk],
});