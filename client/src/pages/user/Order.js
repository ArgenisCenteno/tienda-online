import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import {PayPalButtons } from '@paypal/react-paypal-js';  
import {  useParams } from "react-router-dom"; 
import axios from "axios";
import toast from "react-hot-toast";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import "../../styles/CartStyles.css";
 
const Order = () => { 
  const params = useParams();
  const [loading, setLoading] = useState(false); 
  const [orderData, setOrderData] = useState(null); // Estado para almacenar los datos de la orden
  const [isPaying, setIsPaying] = useState(false);
 
  useEffect(() => {
    setLoading(true);
    const getOrderData = async () => {
      try {
        const { data } = await axios.get(`/api/v1/auth/order/${params._id}`);
         
        setOrderData(data);
        setLoading(false);
      } catch (error) {
         
        setLoading(false);
      }
    };
    getOrderData();
  }, [params.slug]);



  const onOrderCompleted = async (details) => {
    if ( details.status !== 'COMPLETED' ) {
      return toast.error('No hay pago en Paypal'); }

      setIsPaying(true);

      try {
          const orderId = params._id;
          const { data } = await  axios.post("/api/v1/product/paypal-pay", {
              transactionId: details.id,
              orderId, 
          }); 
          window.location.reload()  
      } catch (error) {
          setIsPaying(false); 
          toast.error('Error al realizar el pago');
      }
   
  }
    
  return (
    <Layout style={{ width: "100vw" }}>
    <div className="cart-page">
    <div className="row pt-20">
    {orderData?.order?.isPaid && (
  <div className="col-md-12">
    <h2 className="text-center titleOrder bg-success  p-2 mb-1 pt-0" style={{ backgroundColor: "#059669", color: "#ffff" }}>
      ¡Gracias por comprar en Hella Store!
    </h2>
  </div>
)}
        </div>

      <div className="container" style={{ marginTop: "22px", paddingBottom: "22px" }}>
        <div className="row pb-4">
          <div className="col-lg-8 mb-4 pb-4">
          
          <h4><LocalOfferIcon/> Código: {orderData?.order?._id}</h4> 
          { orderData?.order?.isPaid  ? <h5>Usted ha comprado</h5> : <h5>Productos a pagar</h5> }
            
            {orderData?.order?.products?.map((p, index) => (
             <div className="card mb-3" key={index}>
             <div className="row no-gutters">
               <div className="col-4 col-md-3">
                 <img
                   src={`/api/v1/product/product-photo/${p._id}`}
                   className="card-img-Pay"
                   alt={p.name}
                   style={{ maxHeight: "140px" }}
                 />
               </div>
               <div className="col-4 col-md-6">
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
            <h2>Resumen de la Orden</h2>
            <p>Total | Información de entrega | Pago</p>
            <hr />
            {/* Show the total amount of the order */}
            <h2 style={{ color: "#017752" }}>Total: ${orderData?.order?.total?.toFixed(2)}</h2>
            <h5 style={{ color: "#017752" }}>Subtotal: ${Number(orderData?.order?.subtotal)?.toFixed(2)}</h5>
            <h5 style={{ color: "#017752" }}>Tasa de envío: ${Number(orderData?.order?.address.tasaEnvio)}</h5>
            <hr />

            {/* Show the address details if available */}
            {orderData?.order?.address && (
  <>
    <div className="mb-3">
      <h4>
        <strong>Dirección de entrega</strong>
      </h4>
      <p>
        <strong>Estado:</strong> {orderData?.order?.address.estado}
      </p>
      <p>
        <strong>Municipio:</strong> {orderData?.order?.address.municipio}
      </p>
      <p>
        <strong>Parroquia:</strong> {orderData?.order?.address.parroquia}
      </p>
      <p>
        <strong>Zona:</strong> {orderData?.order?.address.zona}
      </p>
      <p>
        <strong>Código Postal:</strong> {orderData?.order?.address.codigoPostal}
      </p>
      <p>
        <strong>Servicio de Entrega:</strong> {orderData?.order?.address.servicioEntrega}
      </p>
      <p>
        <strong>Contacto:</strong> {orderData?.order?.address.telefono}
      </p>
       
      <hr />
      
    </div>
  </>
)}
    <div className="mb-3">
      <h4>
        <strong>Estado de la Orden</strong>
      </h4>
      <p>
        <strong>{orderData?.order?.status}</strong> 
      </p>
      <h4>
        <strong>Estado de Pago</strong>
      </h4>
           
      { orderData?.order?.isPaid  ? (
        
    <p style={{color: "#059669"}} ><CreditScoreIcon/> <strong>Orden Pagada</strong> </p>
  ) : (
    <>
    <div className="mt-2 botonPago">
                      <p style={{color: "red"}}><CreditCardOffIcon/> <strong>Orden Sin Pagar</strong> </p>
                      {orderData?.order?.total && (
              <PayPalButtons 
              createOrder={(data, actions) => {
                
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: `${orderData?.order?.total}` ,
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
              />)}
             
              </div>

            <span className="span text-black mt-2   "> <strong>Para pagar con pago móvil o transferencia bancaria, contactenos por Whatsapp</strong> </span>
  <a href="https://wa.link/5ye7qg" target="_blank" style={{textDecoration: "none"}}>
              <button className="btn btn-success btn-lg btn-block mt-4" style={{width: "100%"}}> <WhatsAppIcon/> WhatsApp</button>
            </a>

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

export default Order;
