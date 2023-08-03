import React, { useState, useEffect } from "react"; 
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import {PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'; 
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";
import "../index.css"; 
const Payment = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const navigate = useNavigate();

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

  const address = JSON.parse(localStorage.getItem("address"));

  //CALCULAR EL TOTAL 
  const totalPrice = () => {
    try { 
      let total = 0;
      cart?.map((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        total += address?.tasaEnvio; 

      });
      return total
    } catch (error) {
      console.log(error);
    }
  };

 
 //CALCULAR EL SUBTOTAL 
 const subTotal = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
      });

      return total }  catch (error) {
      console.log(error);
    }
  };

  //REMOVER PRODUCTO
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //TRAEMOS UN TOKEN PARA REALIZAR UN PAGO
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) { 
      console.log(error);
    }
  }; 
  useEffect(() => {
    getToken();
  }, [auth?.token]);

   
  //REALIZAMOS EL PAGO
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart, 
        address
      }); 
      console.log(data)
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate( `/dashboard/user/order/${data.order._id}` );
      toast.success("Pago completado correctamente, gracias por su compra");
    } catch (error) {

      if(error.message === "No payment method is available."){
        toast.error("No ha seleccionado un metodo de pago");
      }else{
        toast.error("Error al realizar el pago")
      } 
      console.log(error);
      setLoading(false);
    }
  };

  const onOrderCompleted = async (details) => {
    if ( details.status !== 'COMPLETED' ) {
      return toast.error('No hay pago en Paypal'); }

      setIsPaying(true);

      try {
          
          const { data } = await  axios.post("/api/v1/product/paypal-pay", {
              transactionId: details.id,
            
              cart,
              address
          });

          localStorage.removeItem("cart");
          setCart([]);
          navigate( `/dashboard/user/order/${data.order._id}` );
          toast.success("Pago completado correctamente, gracias por su compra"); 
      } catch (error) {
          setIsPaying(false);
          console.log(error);
          toast.error('Error');
      }
  console.log("Detalles de la transacción:", details);
  }
    
  return (
    <Layout style={{ width: "100vw" }}>
      <div className="cart-page">
        <div className="row pt-20">
          <div className="col-md-12 text-center ">
            <h1 className="text-center bg-success p-2 mb-1 pt-0">
            
              {!auth?.user
                ? "Hola de nuevo"
                : `Hola,  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `Tienes ${cart.length} productos en total ${
                      auth?.token ? "" : "Inicia sesión para continuar"
                    }`
                  : "No tienes productos"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container" style={{ marginTop: "22px", paddingBottom: "22px" }}>
          <div className="row pb-4">
            <div className="col-lg-8 mb-4 pb-4">
              {cart?.map((p) => (
                <div className="card mb-3 card-payment" key={p._id}>
                  <div className="row no-gutters">
                    <div className="col-3 col-md-3">
                    <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        className="card-img-Pay"
                        alt={p.name}
                        style={{ maxHeight: "140px"}} // Ajustar estilos aquí
                      />
                    </div>
                    <div className="col-9 col-md-9">
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">
                          <strong>Talla:</strong> {p.size} <br />
                          <strong>Cantidad:</strong> {p.quantity} <br />
                          <strong>Precio:</strong> {p.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-4 cart-summary">
              <h2>Resumen total de la Orden</h2>
              <p>Total | Verificación | Pago</p>
              <hr />
              <h2 style={{ color: "#017752" }}>Total: {totalPrice()}</h2>
              <h5 style={{ color: "#017752" }}>Subtotal: {subTotal()}</h5>
              <h5 style={{ color: "#017752" }}>Tasa de envío: ${address.tasaEnvio} </h5>
              <hr />
              {address ? (
                <>
                  <div className="mb-3">
                    <h4>
                      <strong>Dirección de entrega</strong>
                    </h4>
                    <p>
                      <strong>Estado:</strong> {address.estado}
                    </p>
                    <p>
                      <strong>Municipio:</strong> {address.municipio}
                    </p>
                    <p>
                      <strong>Parroquia:</strong> {address.parroquia}
                    </p>
                    <p>
                      <strong>Zona:</strong> {address.zona}
                    </p>
                    <p>
                      <strong>Código Postal:</strong> {address.codigoPostal}
                    </p>
                    <p>
                      <strong>Servicio de Entrega:</strong> {address.servicioEntrega}
                    </p>
                    <p>
                      <strong>Contacto:</strong> {address.telefono}
                    </p>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/checkout")}
                    >
                      Modificar dirección de entrega
                    </button>
                    <hr />
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button className="btn btn-success " onClick={() => navigate("/checkout")}>
                      Checkout
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/login", { state: "/cart" })}
                    >
                      Por favor, inicia sesión para continuar
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2 botonPago">
                     
              <PayPalButtons 
              createOrder={(data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value:  totalPrice().toString(),
                            },
                        },
                    ],
                });
            }}
            onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                    onOrderCompleted( details );
                    // console.log({ details  })
                    // const name = details.payer.name.given_name;
                    // alert(`Transaction completed by ${name}`);
                });
            }}
              />
     

                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                 
                     <p className="text-left">Seleccione un metodo de pago</p>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-success "
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Cargando ...." : "Realizar pago"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
