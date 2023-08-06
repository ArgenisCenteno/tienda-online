import React  from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom"; 
  
import "../styles/CartStyles.css";
 
const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
   
  const navigate = useNavigate();
  //CALCULAR EL TOTAL 
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
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

   
  
  return (
    <Layout style={{width: "100vw"}}>
      <div className=" cart-page">
        <div className="row pt-20" >
          <div className=" col-md-12">
            <h1 className="text-center bg-light p-2 mb-1 pt-0">
              {!auth?.user
                ? "Hola de nuevo" 
                : `Hola,  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `Tienes ${cart.length} productos en tu carrito, ${
                      auth?.token ? "" : "Inicia sesión para continuar"
                    }`
                  : "Tú carrito está vacío"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container " style={{marginTop: "22px", paddingBottom: "22px", marginBottom: "16rem"}}>
        <div className="row pb-4">
          <div className="col-lg-8 mb-4 pb-4">  
            
            {cart.map((p, index) => (
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
               <div className="col-1 col-sm-2 pt-1 cart-remove-btn">
              <button
               className="btn btn-danger"
               onClick={() => removeCartItem(p._id)}
              >
                 X
            </button>
    </div>
             </div>
           </div>
            ))}
          </div>

            <div className="col-lg-4 col-xs-4 col-sm-4 cart-summary ">
              <h2>Resumen de Orden</h2>
              <p>Total | Ingresar dirección | Pago</p>
              <hr />
              <h4>Total: {totalPrice()}</h4> 
              {auth?.user  ? (
                <>
                <div className="mb-3">
                  <h5>{auth?.user?.address}</h5>
                  {cart.length > 0 ? ( // Verificar si el carrito no está vacío
                    <button
                      className="btn btn-success"
                      onClick={() => navigate("/checkout")}
                    >
                      Checkout
                    </button>
                  ) : (
                    <button className="btn btn-success" disabled>Checkout</button> // Deshabilitar el botón cuando el carrito está vacío
                  )}
                </div>
              </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-success "
                      onClick={() => navigate("/checkout")}
                    >
                      Checkout
                    </button>
                  ) : (
                   <>
                     <button
                      className="btn btn-outline-warning mb-2"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Inicia sesión para continuar
                    </button>
                    <br></br>
                    <button
                    className="btn btn-outline-success"
                    onClick={() =>
                      navigate("/register", {
                        state: "/cart",
                      })
                    }
                  >
                    Registrarse para continuar
                  </button>
                   </>
                  )}
                </div>
              )}
             
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
