import "./Chat.css";
import { rootStore } from "../../types";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendTextMessage } from "../../features/thunks/chatThunk";
import { AppDispatch } from "../../store";

function Chat() {
  const messageStore = useSelector((state: rootStore) => state.messages);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const messagesListRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageStore]);

  useEffect(() => {
    console.log(isLoading);
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

  async function sendTestMessage() {
    if (!isLoading && input.length > 0) {
      setIsLoading(true);
      try {
        await dispatch(
          sendTextMessage({
            message: input,
          })
        );
      } finally {
        setIsLoading(false);
        setInput("");
      }
    } else {
      console.log("Double click protection");
    }
  }

  return (
    <div className="chat">
      <div ref={messagesListRef} className="chat__message-list">
        {messageStore.messages.map((message, i) => {
          return (
            <div key={`message_${i}`} className="message">
              {message.map((paragraph, j) => {
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendTestMessage();
            } else {
              // console.log("input");
              if (e.currentTarget.textContent) {
                setInput(e.currentTarget.textContent);
              } else {
                setInput("");
              }
            }
          }}
        ></div>
        <button className="send-button" onClick={sendTestMessage}>
          {">"}
        </button>
      </div>
    </div>
  );
}

export default Chat;
