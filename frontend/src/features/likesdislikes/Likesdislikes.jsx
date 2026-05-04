import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { dislike, like } from "./likesdislikesSlice";

function Likesdislikes() {
  var { likes, dislikes } = useSelector((state) => state.likedislikeReducer);
  var dispatch = useDispatch();
  return (
    <div className="mybox">
      <h1>Likesdislikes</h1>
      <i
        class="bi bi-hand-thumbs-up display-5 px-5"
        onClick={() => {
          dispatch(like());
        }}
      >
        {likes}
      </i>

      <i
        class="bi bi-hand-thumbs-down display-5"
        onClick={() => {
          dispatch(dislike());
        }}
      >
        {dislikes}
      </i>
    </div>
  );
}

export default Likesdislikes;
