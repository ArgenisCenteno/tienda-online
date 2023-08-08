import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useCart } from "../context/cart";
 
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const [values, setValues] = useSearch();
   
  return (
    <Layout title={"Resultados de búsqueda"}> 
      <div className="container">
        <div className="text-center text-success mt-4">
          <h3>Resultados de {values?.keyword}</h3>
          <h5 className="resultPage">
            {values?.results.length < 1
              ? "No se encontraron productos"
              : `Resultados ${values?.results.length}`}
          </h5>
          <div className="d-flex flex-wrap justify-content-center mt-4">
            {values?.results.map((p, index) => (
              <div className="card m-2" style={{ width: "18rem" }} key={index}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)} 
                  </p>
                  <p className="card-text">
                      <strong>Tallas:</strong>{" "}
                      {p.variations.map((e) => e.size).join(" | ")}
                    </p>
                  
                  <div className="card-name-price">
                      <button
                        className="btn btn-info ms-1 text-white verDetalles"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        Ver detalles
                      </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;


