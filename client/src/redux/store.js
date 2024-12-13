import { combineReducers, configureStore } from "@reduxjs/toolkit";
import adminReducer from "./admin/adminSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Combine all the reducers into a single root reducer
const rootReducer = combineReducers({
  admin: adminReducer,
});

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// Create a persist reducer using the persist configuration and the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store with the persisted reducer and middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create the persistor which will be used to persist the store
export const persistor = persistStore(store);
