import React from "react";
import { useGetAllRecipesQuery } from "../../services/recipesAPI";
import { Link, Outlet } from "react-router-dom";

function Recipes() {
  const { isLoading, data } = useGetAllRecipesQuery();
  return (
    <div>
      <h1>Recipes {isLoading && <b>Loading...</b>}</h1>
      <div className="d-flex">
        <ul className="w-50">
          {!isLoading &&
            data?.recipes?.map((recipe) => {
              return (
                <li>
                  <Link to={`/recipes/recipeDetails/${recipe.id}`}>
                    {recipe.name}
                  </Link>
                </li>
              );
            })}
        </ul>
        <div className="w-50">
          <h4>Details</h4>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export default Recipes;
