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
      if (!Array.isArray(state.messages)) {
        console.log("New message is not array");
        return state;
      }
      // state.messages.push({ text: [action.payload], type: "test type" });
      return {
        ...state,
        messages: [
          ...state.messages,
          { text: [action.payload], type: "test type" },
        ],
      };
    },
    updateLastMessage: (state, action) => {
      const lastMessageIndex = state.messages.length - 1;
      const lastParagraphIndex =
        state.messages[lastMessageIndex].text.length - 1;
      const lastMessage = state.messages[lastMessageIndex];

      if (action.payload.includes("\n\n")) {
        const splittedLine = action.payload.split("\n\n");
        return {
          ...state,
          messages: [
            ...state.messages.slice(0, lastMessageIndex),
            {
              text: [
                ...lastMessage.text.slice(0, lastParagraphIndex),
                lastMessage.text[lastParagraphIndex] + splittedLine[0],
                splittedLine[1],
              ],
              type: "test type 2",
            },
          ],
        };

        // state.messages[lastMessageIndex][lastParagraphIndex] += splittedLine[0];
        // state.messages[lastMessageIndex].push("");
        // state.messages[lastMessageIndex][lastParagraphIndex + 1] +=
        //   splittedLine[1];
      } else {
        return {
          ...state,
          messages: [
            ...state.messages.slice(0, lastMessageIndex),
            {
              text: [
                ...state.messages[lastMessageIndex].text.slice(
                  0,
                  lastParagraphIndex
                ),
                lastMessage.text[lastParagraphIndex] + action.payload,
              ],
              type: "test type 3",
            },
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
