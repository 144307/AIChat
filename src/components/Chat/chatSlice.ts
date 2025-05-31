import { createSlice } from "@reduxjs/toolkit";
import { chatMessages } from "../../types";
import { sendTextMessage } from "../../features/thunks/chatThunk";

const initialState: chatMessages = {
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    addMessageToEnd: (state, action) => {
      if (!Array.isArray(state.messages) || state.messages.length === 0) {
        console.log("empty or not array");
        // return {
        //   ...state,
        //   messages: [...state.messages.slice(0, -1), [action.payload]],
        // };
      }
      // console.log("action", action.payload);
      return {
        ...state,
        messages: [...state.messages, [action.payload]],
      };
    },
    updateLastMessage: (state, action) => {
      const lastMessageIndex = state.messages.length - 1;
      const lastParagraphIndex = state.messages[lastMessageIndex].length - 1;
      const lastMessage = state.messages[lastMessageIndex];

      if (action.payload.includes("\n\n")) {
        const splittedLine = action.payload.split("\n\n");
        return {
          ...state,
          messages: [
            ...state.messages.slice(0, lastMessageIndex),
            [
              ...lastMessage.slice(0, lastParagraphIndex),
              lastMessage[lastParagraphIndex] + splittedLine[0],
              splittedLine[1],
            ],
          ],
        };

        // state.messages[lastMessageIndex][lastParagraphIndex] += splittedLine[0];
        // state.messages[lastMessageIndex].push("");
        // state.messages[lastMessageIndex][lastParagraphIndex + 1] +=
        //   splittedLine[1];
      } else {
        // console.log(action.payload);
        return {
          ...state,
          messages: [
            ...state.messages.slice(0, lastMessageIndex),
            [
              ...state.messages[lastMessageIndex].slice(0, lastParagraphIndex),
              lastMessage[lastParagraphIndex] + action.payload,
            ],
          ],
        };
      }
    },
    deleteMessage: () => {
      // pass
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendTextMessage.pending, () => {
        console.log("pending");
      })
      .addCase(sendTextMessage.fulfilled, () => {
        console.log("fulfilled");
      });
  },
});

export const { addMessageToEnd, updateLastMessage, deleteMessage } =
  chatSlice.actions;

export default chatSlice.reducer;
