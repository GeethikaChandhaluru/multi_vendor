import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: ["complete this batch", "do your work", "goto home"],
};

export const todolistSlice = createSlice({
  name: "todosSlice",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.todos.push(action.payload);
    },
    delTodo: (state, action) => {
      state.todos.splice(action.payload, 1);
    },
  },
});

export const { addTodo, delTodo } = todolistSlice.actions;
const todolistReducer = todolistSlice.reducer;
export default todolistReducer;
