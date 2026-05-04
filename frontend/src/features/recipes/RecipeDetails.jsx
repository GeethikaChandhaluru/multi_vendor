import React from "react";
import { useGetRecipeByIdQuery } from "../../services/recipesAPI";
import { useParams } from "react-router-dom";

function RecipeDetails() {
  var { id } = useParams();
  const { isLoading, data } = useGetRecipeByIdQuery(id);
  return (
    <div>
      <h1>RecipeDetails {isLoading && <b>Loading...</b>}</h1>
      <h1>{data?.name}</h1>
    </div>
  );
}

export default RecipeDetails;
