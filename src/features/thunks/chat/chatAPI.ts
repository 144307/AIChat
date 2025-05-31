// import { Dispatch, SetStateAction } from "react";

const baseURL = "http://localhost:3000";
// const baseURL = "http://localhost:5001";

interface DataArray {
  token: string;
  finish_reason: string;
}

// function replaceLastItem(
//   // replace last item in array state
//   setState: Dispatch<SetStateAction<string[][]>>,
//   newItem: string[]
// ) {
//   setState((state) => {
//     if (!Array.isArray(state) || state.length === 0) {
//       return state;
//     }
//     return [...state.slice(0, -1), newItem];
//   });
// }

function getBody(message: string) {
  const body = {
    max_context_length: 2048,
    max_length: 100,
    prompt: message,
    quiet: false,
    rep_pen: 1.1,
    rep_pen_range: 256,
    rep_pen_slope: 1,
    temperature: 0.5,
    tfs: 1,
    top_a: 0,
    top_k: 100,
    top_p: 0.9,
    typical: 1,
  };
  return body;
}

async function* parseSSE(stream: ReadableStream<Uint8Array<ArrayBufferLike>>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");

    // check what it does exactly
    // const line = lines.pop();
    // if (line) {
    //   buffer = line;
    // }
    buffer = lines.pop();

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        yield line.slice(6);
      }
    }
  }
}

export async function generateStream(
  message: string,
  callback: (line: string) => void,
  addMessage: (line: string) => void
) {
  const url = baseURL + "/api/extra/generate/stream";
  let isFirstMessage = true;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(getBody(message)),
  });

  for await (const chunk of parseSSE(response.body)) {
    const line: DataArray = JSON.parse(chunk);
    if (isFirstMessage) {
      // console.log("first message");
      // callback(line.token);
      addMessage(line.token);
      isFirstMessage = false;
    } else {
      callback(line.token);
    }
  }

  if (!response.ok) {
    throw new Error(`Request Error ${response.status}`);
  }
}
