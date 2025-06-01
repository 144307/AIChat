import { createAsyncThunk } from "@reduxjs/toolkit";
import { generateStream } from "./chat/chatAPI.ts";
import {
  addMessageToEnd,
  updateLastMessage,
} from "../../components/Chat/chatSlice.ts";

export const getModelName = createAsyncThunk("model/getModelName", async () => {
  // const response = await fetch("http://localhost:5001/api/v1/model");
  // const data = response.json();
  return "data";
});

interface sendTextMessageArgs {
  message: string;
}

export const sendTextMessage = createAsyncThunk<void, sendTextMessageArgs>(
  "chat/sendTextMessage",
  async ({ message }, thunkAPI) => {
    try {
      await generateStream(
        message,
        (line) => {
          thunkAPI.dispatch(updateLastMessage({ text: line, type: "bot" }));
        },
        (line) => {
          // console.log("addMessage", line);
          thunkAPI.dispatch(addMessageToEnd({ text: line, type: "bot" }));
        }
      );
    } catch (e) {
      console.log(`Cached Error ${e}`);
      return thunkAPI.rejectWithValue((e as Error).message);
    }
  }
);
