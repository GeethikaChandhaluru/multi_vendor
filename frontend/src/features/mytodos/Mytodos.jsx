import React, { useState } from "react";
import {
  useAddTodoItemMutation,
  useDeleteTodoItemMutation,
  useGetAllTodosQuery,
  useLazyGetAllTodosQuery,
} from "../../services/todosAPI";

function Mytodos() {
  var { isLoading, data } = useGetAllTodosQuery();
  var [getLatestTodosFn] = useLazyGetAllTodosQuery();
  var [addtodoItemFn] = useAddTodoItemMutation();
  var [deleteTodoItemFn] = useDeleteTodoItemMutation();
  const [ntd, setNtd] = useState("");
  function handleDeleteItem(id) {
    deleteTodoItemFn(id).then(() => {
      getLatestTodosFn();
    });
  }
  return (
    <div>
      <h1>Mytodos</h1>
      <input type="text" onChange={(e) => setNtd(e.target.value)} value={ntd} />
      <button
        onClick={() => {
          addtodoItemFn({ title: ntd, status: "notcompleted" }).then(() => {
            getLatestTodosFn();
          });
        }}
      >
        Add Todo
      </button>
      {!isLoading &&
        data?.map((todo) => {
          return (
            <li>
              {todo.title}
              <button
                onClick={() => {
                  handleDeleteItem(todo.id);
                }}
              >
                Delete
              </button>
            </li>
          );
        })}
    </div>
  );
}

export default Mytodos;
