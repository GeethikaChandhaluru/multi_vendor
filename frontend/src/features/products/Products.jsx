import React from "react";
import { useGetAllProductsQuery } from "../../services/productsAPI";

function Products() {
  const { isLoading, data } = useGetAllProductsQuery();
  console.log("isLoading..", isLoading);
  return (
    <div className="mybox">
      <h1>Products Component</h1>
      {isLoading && (
        <img
          src={
            "https://mir-s3-cdn-cf.behance.net/project_modules/hd/afcd2c69321565.5b7d0cbe727b1.gif"
          }
          width="200px"
        />
      )}
      {!isLoading &&
        data?.products?.map((p) => {
          return <li>{p.title}</li>;
        })}
    </div>
  );
}

export default Products;
