import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

export const counterSlice = createSlice({
  name: "counterslice",
  initialState,
  reducers: {
    inc: (state) => {
      state.count++;
    },
    dec: (state) => {
      state.count--;
    },
    reset: (state) => {
      state.count = 0;
    },
  },
});

export const { inc, dec, reset } = counterSlice.actions;
const counterReducer = counterSlice.reducer;
export default counterReducer;
