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
import useThrottle from "../../features/hooks/useThrottle";

function Chat() {
  const messageStore = useSelector((state: rootStore) => state.messages);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const messagesListRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState(
    "Niko the kobold stalked carefully down the alley, his small scaly figure obscured by a dusky cloak that fluttered lightly in the cold winter breeze."
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setFocus();
  }, []);

  useEffect(() => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageStore]);

  useEffect(() => {
    if (inputRef.current) {
      if (isLoading) {
        // inputRef.current.contentEditable = "false";
        inputRef.current.disabled = true;
      } else {
        inputRef.current.disabled = false;
        // inputRef.current.contentEditable = "true";
      }
    } else {
      console.log("inputRef.current doesn't exist");
    }
  }, [isLoading]);

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== input) {
      inputRef.current.value = input;
    }
    inputRef.current.style.height = "";
    inputRef.current.style.height = inputRef.current?.scrollHeight + "px";
  }, [input]);

  // function throttle(callback: (...args: unknown[]) => void, delay = 5000) {
  //   let isWaiting = false;
  //   return function (...args: unknown[]) {
  //     if (isWaiting) {
  //       return;
  //     }

  //     callback(...args);
  //     isWaiting = true;

  //     setTimeout(() => {
  //       isWaiting = false;
  //     }, delay);
  //   };
  // }

  function setFocus() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const throttledSend = useThrottle(async () => {
    console.log("sendMessage");
    if (!isLoading && input.length > 0) {
      console.log("send message", input);
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
        setFocus();
      }
    } else if (isLoading) {
      dispatch(stopGeneration());
      // console.log("Double click protection");
    }
  });

  // const handleSend = throttle(sendMessage);
  const handleSend = () => {
    throttledSend();
  };

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
        <textarea
          ref={inputRef}
          id="input"
          autoFocus
          contentEditable
          className={`chat__input${isLoading ? " chat__input_inactive" : ""}`}
          onInput={(e) => {
            if (e.currentTarget.value) {
              setInput(e.currentTarget.value);
            } else {
              setInput("");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        ></textarea>
        <button className="send-button" onClick={handleSend}>
          {`${isLoading ? "S" : ">"}`}
        </button>
      </div>
    </div>
  );
}

export default Chat;
