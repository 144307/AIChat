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
  const inputRef = useRef(null);

  useEffect(() => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageStore]);

  useEffect(() => {
    if (isLoading) {
      inputRef.current.contentEditable = false;
    } else {
      inputRef.current.contentEditable = true;
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
        {/* {messages.map((message, i) => { */}
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
          contentEditable
          className={`chat__input${isLoading ? " chat__input_inactive" : ""}`}
          onInput={(e) => {
            if (e.currentTarget.textContent) {
              setInput(e.currentTarget.textContent);
            } else {
              setInput("");
            }
          }}
        ></div>
        <button className="send-button" onClick={sendTestMessage}>
          {">"}
        </button>
      </div>
      {isLoading}
      {/* <div className="test-block">{messageStore.modelName}</div> */}
    </div>
  );
}

export default Chat;
