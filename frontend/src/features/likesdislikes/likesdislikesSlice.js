import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  likes: 0,
  dislikes: 0,
};

export const likesdislikesSlice = createSlice({
  name: "ldslice",
  initialState,
  reducers: {
    like: (state) => {
      state.likes++;
    },
    dislike: (state) => {
      state.dislikes++;
    },
  },
});

export const { like, dislike } = likesdislikesSlice.actions;
const likedislikeReducer = likesdislikesSlice.reducer;
export default likedislikeReducer;
