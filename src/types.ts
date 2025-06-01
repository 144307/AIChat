// export interface message {
//   max_context_length: number;
//   max_length: number;
//   prompt: string;
//   quiet: boolean;
//   rep_pen: number;
//   rep_pen_range: number;
//   rep_pen_slope: number;
//   temperature: number;
//   tfs: number;
//   top_a: number;
//   top_k: number;
//   top_p: number;
//   typical: number;
// }

export interface chatMessage {
  type: string; // ai or user
  text: string[];
}

export interface chatMessages {
  messages: chatMessage[];
  // messages: string[][];
}

export interface globalSate {
  modelName: string;
}

export interface rootStore {
  messages: chatMessages;
  globalSate: globalSate;
}
