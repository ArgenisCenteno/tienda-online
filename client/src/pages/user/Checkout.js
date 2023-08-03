import React, { useState, useEffect } from 'react';
import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";
import Layout from "../../components/Layout/Layout.js";
import axios from "axios";
import camion from "../img/camion.png"
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import image from "../../pages/img/image.png";

const initialState = {
  estado: '',
  municipio: '',
  parroquia: '',
  zona: '',
  codigoPostal: '',
  servicioEntrega: '',
  telefono: '',
  tasaEnvio: 0,
};

const Checkout = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [isFormComplete, setIsFormComplete] = useState(false);

 
  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem('auth');
    if (!isAuthenticated) {
      navigate("/login");
      toast.error("Debe iniciar sesión para hacer checkout");
    }
  }, [navigate]);

  
  useEffect(() => {
    // Obtener el carrito del localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

    // Verificar si el carrito está vacío
    if (cartItems.length === 0) {
      navigate("/cart");
      toast.error("Agregue productos a su carrito");
    }
  }, [navigate]);
 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setFormData({
        ...formData,
        estado: 'Apure',
        municipio: 'Achaguas',
        parroquia: 'Achaguas',
        codigoPostal: '7002'
      });
    } else {
      setFormData(initialState); // Aquí se reinician todos los campos
    }
  };

  const userId =  auth?.user?._id

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe automáticamente
  
    try {  
      setLoading(true);
      const { data } = await axios.post("/api/v1/product/create-order", { 
        cart, 
        formData, 
        userId
      });  
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      
      // Redireccionar a la ruta de la orden completada
      navigate(`/dashboard/user/order/${data.order._id}`);
      
      toast.success("Orden iniciada");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Verificar si todos los campos requeridos están completos
  useEffect(() => {
    const { estado, municipio, parroquia, zona, codigoPostal, servicioEntrega, telefono, tasaEnvio } = formData;
    setIsFormComplete(
      estado !== '' &&
      municipio !== '' &&
      parroquia !== '' &&
      zona !== '' &&
      codigoPostal !== '' &&
      servicioEntrega !== '' &&
      telefono !== ''&&
      tasaEnvio !== ''
    );
  }, [formData]);

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    if (value === "Delivery") {
      setFormData({
        ...formData,
        [name]: value,
        tasaEnvio: 5,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
        tasaEnvio: 0,
      });
    }
  };
  

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center form-address">
          <div className="col-10 col-md-6">
            <h1 style={{ color: "#047450" }}>Datos de entrega</h1>
            <a href="https://wa.link/5ye7qg" target="_blank">
            <img src={image} className="whatsapp" alt="HelloBanner" width={"100%"} />
          </a>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <strong><label>Estado:</label></strong>
                <input type="text" name="estado" className="form-control" value={formData.estado} onChange={handleChange} />
              </div>
              <div className="form-group">
                <strong><label>Municipio:</label></strong>
                <input type="text" name="municipio" className="form-control" value={formData.municipio} onChange={handleChange} />
              </div>
              <div className="form-group">
                <strong><label>Parroquia:</label></strong>
                <input type="text" name="parroquia" className="form-control" value={formData.parroquia} onChange={handleChange} />
              </div>
              <div className="form-group">
                <strong><label>Zona:</label></strong>
                <input type="text" name="zona" className="form-control" value={formData.zona} onChange={handleChange} />
              </div>
              <div className="form-group">
                <strong><label>Código Postal:</label></strong>
                <input type="text" name="codigoPostal" className="form-control" value={formData.codigoPostal} onChange={handleChange} />
              </div>
              <div className="form-group">
                  <strong><label>Servicio de Entrega:</label></strong>
                  <select name="servicioEntrega" className="form-control" value={formData.servicioEntrega} onChange={handleSelectChange}>

                   <option value="">Seleccionar servicio de entrega</option>
                   <option value="MRW">MRW</option>
                   <option value="ZOOM">ZOOM</option>
                   <option value="Tealca">Tealca</option>
                   <option value="Delivery">Delivery</option>
                   <option value="Retirar en negocio">Retirar en negocio</option>
                 </select>
                </div>
              <div className="form-group">
                <strong><label>Teléfono de contacto:</label></strong>
                <input type="text" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} />
              </div>
              <div className="form-group">
        <strong><label>Tasa de Envío:</label></strong>
        <input
          type="number"
          name="tasaEnvio"
          className="form-control"
          value={formData?.tasaEnvio}
          onChange={handleChange}
          readOnly  
        />
      </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" onChange={handleCheckboxChange} />
                <strong><label className="form-check-label">Soy de Achaguas</label></strong>
              </div>
              <button type="submit" className="btn btn-success mt-3" disabled={!isFormComplete}>
                Continuar
              </button>
            </form>
          </div>
          <div className="col-6 col-md-6">
            <div className="row justify-content-center">
              <div className="col-10 col-md-8 text-center my-3 image-payment" >
                <img src={camion} alt='delivery' />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-10 col-md-10 text-left mb-3">
                <h2>Tenemos delivery en Achaguas, para envíos nacionales contacte con Atención al Cliente presionando el icono de WhatsApp</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
