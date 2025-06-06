import { createAsyncThunk } from "@reduxjs/toolkit";
import { generateStream, abortGeneration } from "./chat/chatAPI.ts";
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

export const stopGeneration = createAsyncThunk(
  "chat/stopGeneration",
  async (_, thunkAPI) => {
    // console.log("thunk stop");
    try {
      // abortGeneration().then((response) => {
      //   console.log("response", response);
      // });
      const response = await abortGeneration();
      console.log("stop status", response);
    } catch (e) {
      console.log(e);
      return thunkAPI.rejectWithValue((e as Error).message);
    }
  }
);

export const sendTextMessage = createAsyncThunk<void, sendTextMessageArgs>(
  "chat/sendTextMessage",
  async ({ message }, thunkAPI) => {
    try {
      const response = await generateStream(
        message,
        (line) => {
          thunkAPI.dispatch(updateLastMessage({ text: line, type: "bot" }));
        },
        (line) => {
          // console.log("addMessage", line);
          thunkAPI.dispatch(addMessageToEnd({ text: line, type: "bot" }));
        }
      );
      return response;
    } catch (e) {
      console.log(`Cached Error ${e}`);
      return thunkAPI.rejectWithValue((e as Error).message);
    }
  }
);
