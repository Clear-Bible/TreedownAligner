import { configureStore } from '@reduxjs/toolkit';
import combinedReducer from 'app/combinedReducer';

export const store = configureStore({ ...combinedReducer });

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
