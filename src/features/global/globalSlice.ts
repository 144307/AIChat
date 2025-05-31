import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modelName: "undefined",
};

const globalSlice = createSlice({
  name: "globalSate",
  initialState: initialState,
  reducers: {
    updateModelName: (state) => {
      state.modelName = "update";
    },
  },
});

export const { updateModelName } = globalSlice.actions;

export default globalSlice.reducer;
