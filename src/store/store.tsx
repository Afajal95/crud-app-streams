import { configureStore } from "@reduxjs/toolkit";
import streamsReducer from "../streams/streamSlice";

export const store = configureStore({
  reducer: {
    streams: streamsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
