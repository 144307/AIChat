import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./components/Chat/chatSlice";
import globalReducer from "./features/global/globalSlice";

export const store = configureStore({
  reducer: {
    messages: chatReducer,
    globalSate: globalReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
