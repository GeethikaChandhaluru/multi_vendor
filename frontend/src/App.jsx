import Counter from "./features/counter/Counter";
import Todolist from "./features/todolist/Todolist";
import Likesdislikes from "./features/likesdislikes/Likesdislikes";
import Products from "./features/products/Products";
import { Outlet } from "react-router-dom";
import Navbar from "./component/Navbar";
function App() {
  return (
    <div className="mybox">
      <Navbar></Navbar>
      <Outlet></Outlet>
    </div>
  );
}

export default App;
