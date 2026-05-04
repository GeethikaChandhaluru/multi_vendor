import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo } from "./todolistSlice";

function Todolist() {
  const { todos } = useSelector((state) => state.todolistReducer);
  const dispatch = useDispatch();
  const [ntd, setNtd] = React.useState("");

  return (
    <div className="mybox">
      <h1>Todolist</h1>
      <input
        type="text"
        onChange={(e) => {
          setNtd(e.target.value);
        }}
      />
      <button
        onClick={() => {
          dispatch(addTodo(ntd));
        }}
      >
        Add Todo
      </button>
      <ul>
        {todos.map((t) => {
          return <li>{t}</li>;
        })}
      </ul>
    </div>
  );
}

export default Todolist;
