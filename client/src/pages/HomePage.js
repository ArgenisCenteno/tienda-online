import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "antd";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import tienda from "./img/tienda.png";
import image from "./img/image.png";
import "../styles/Homepage.css";
import Slider from "../components/Layout/Slider";
import { sliderItems } from '../components/Layout/data/data.js';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [foundProducts, setFoundProducts] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sliderPosition, setSliderPosition] = useState("0");


  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  // OBTENER TODAS LAS CATEGORIAS
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // OBTENER PRODUCTOS
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const page = 1;
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
      setFoundProducts(data.products.length > 0);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // OBTENER PRODUCTOS FILTRADOS POR CATEGORÍA
  const getFilteredProducts = async (categoryId) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked: [categoryId],
        radio,
      });
      setLoading(false);
      setProducts(data.products);
      setFoundProducts(data.products.length > 0);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // OBTENER NUMERO TOTAL DE PRODUCTOS
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // FILTRAR POR CATEGORIA
  const handleFilter = (value, id, name) => {
    let all = [...checked];
    if (value) {
      all.push(id);
      setSelectedCategory(name);
    } else {
      all = all.filter((c) => c !== id);
      setSelectedCategory("");
      getFilteredProducts();
    }
    setChecked(all);

    if (all.length === 0) {
      getAllProducts();
    } else {
      getFilteredProducts(id);
    }
  };

  // Resetear filtros y obtener todos los productos
  const resetFilters = () => {
    setChecked([]);
    setRadio([]);
    getAllProducts();
    setFoundProducts(true);
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const checkedCategories = categories.filter((c) => checked.includes(c._id));
      if (checkedCategories.length === 0) {
        getAllProducts();
      }
    }
  }, [categories, checked]);

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  // OBTENER PRODUCTO FILTRADO
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
      setFoundProducts(data.products.length > 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (checked.length === 0) {
      setFoundProducts(true);
    }
  }, [checked]);

  useEffect(() => {
    if (selectedCategory) {
      document.title = `Resultado de ${selectedCategory}`;
    } else {
      document.title = "Hella Store";
    }
  }, [selectedCategory]);

  return (
    <Layout title={selectedCategory ? `Resultado de ${selectedCategory}` : "Hella Store"} >
      <Slider slides={sliderItems} /> 
     
      <div className="container-fluid row mt-3 home-page ">
      <div className="col-md-3 m-2 filters">
        <h4 className="text-center mb-4">Filtrar por categoria</h4>
        <a href="https://wa.link/ticqhf" target="_blank">
            <img src={image} className="whatsapp" alt="HelloBanner" width={"100%"} />
          </a>
        <button
          className="btn btn-info mb-3 mt-4 d-md-none " // "d-md-none" para ocultar el botón en pantallas medianas y grandes
          onClick={toggleMenu}
        >
          {isMenuOpen ? "Cerrar Filtros" : "Abrir Filtros"}
        </button>
        <div className={`d-md-flex flex-column ${isMenuOpen ? "d-block" : "d-none"}`}>
          {categories?.map((c) => (
            <Checkbox
              className="filter-checkbox"
              key={c._id}
              onChange={(e) => handleFilter(e.target.checked, c._id, c.name)}
            >
              {c.name}
            </Checkbox>
          ))}
          <a href="/">
            <button className="btn btn-info mb-3 mt-4" onClick={resetFilters}>
              Resetear filtros
            </button>
          </a>
        </div>
      </div>
        <div className="col-md-9 m-8">
          <h1 className="text-center mt-8">
            {selectedCategory
              ? `Resultado de ${selectedCategory}`
              : "Todos los productos"}
          </h1>
          {loading ? (
            <div className="text-center mt-4">
              <h4>Cargando...</h4>
            </div>
          ) : (
            <div className="container d-flex justify-content-center card-products">
              <div className="d-flex flex-wrap center-cards">
                {!foundProducts ? (
                  <div className="text-center mt-4">No hay productos disponibles.</div>
                ) : (
                  products.map((p) => (
                    <div className="card m-2" key={p._id}>
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top"
                        alt={p.name}
                      />
                      <div className="card-body">
                        <div className="card-name-price">
                          <h5 className="card-title">{p.name}</h5>
                        </div>
                        <p className="card-text">{p.description}</p>
                        <p className="card-text">
                          <strong>Tallas:</strong> {p.variations.map((e) => e.size).join(" | ")}
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
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
