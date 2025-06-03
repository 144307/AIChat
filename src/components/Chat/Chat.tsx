import "./Chat.css";
import { rootStore } from "../../types";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendTextMessage,
  stopGeneration,
} from "../../features/thunks/chatThunk";
import { AppDispatch } from "../../store";
import { addMessageToEnd } from "./chatSlice";

function Chat() {
  const messageStore = useSelector((state: rootStore) => state.messages);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const messagesListRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState(
    "Niko the kobold stalked carefully down the alley, his small scaly figure obscured by a dusky cloak that fluttered lightly in the cold winter breeze."
  );
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFocus();
  }, []);

  useEffect(() => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageStore]);

  useEffect(() => {
    if (inputRef.current) {
      if (isLoading) {
        inputRef.current.contentEditable = "false";
      } else {
        inputRef.current.contentEditable = "true";
      }
    } else {
      console.log("inputRef.current doesn't exist");
    }
  }, [isLoading]);

  useEffect(() => {
    if (inputRef.current && inputRef.current.textContent !== input) {
      inputRef.current.textContent = input;
    }
  }, [input]);

  function setFocus() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  async function handleSend() {
    if (!isLoading && input.length > 0) {
      dispatch(addMessageToEnd({ text: input, type: "user" }));
      setInput("");
      setIsLoading(true);
      try {
        await dispatch(
          sendTextMessage({
            message: input,
          })
        );
      } finally {
        setIsLoading(false);
      }
    } else if (isLoading) {
      dispatch(stopGeneration());
      // console.log("Double click protection");
    }
  }

  // const handleSend = debounce(sendMessage);

  return (
    <div className="chat">
      <div ref={messagesListRef} className="chat__message-list">
        {messageStore.messages.map((message, i) => {
          return (
            <div
              key={`message_${i}`}
              className={`message ${message.type === "user" && "message_user"}`}
            >
              {message.text.map((paragraph, j) => {
                return (
                  <p key={`paragraph_${i}_${j}`} className="message__paragraph">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          );
        })}
        <div ref={anchorRef}></div>
      </div>
      <div className="input-wrapper">
        <div
          ref={inputRef}
          id="input"
          autoFocus
          contentEditable
          className={`chat__input${isLoading ? " chat__input_inactive" : ""}`}
          onInput={(e) => {
            if (e.currentTarget.textContent) {
              setInput(e.currentTarget.textContent);
            } else {
              setInput("");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        ></div>
        <button className="send-button" onClick={handleSend}>
          {">"}
        </button>
      </div>
    </div>
  );
}

export default Chat;
