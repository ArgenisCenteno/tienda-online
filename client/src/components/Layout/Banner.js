import React from 'react'
import StoreIcon from '@mui/icons-material/Store';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Banner = () => {
  return (
    <div> 
    <footer className="text-center   text-lg-start bg-success  text-white">
      
      <section className="">
        <div className="container text-center text-md-start pt-5 ">
         
          <div className="row mt-3">
            
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              
              <h6 className="text-uppercase fw-bold mb-4">
                <StoreIcon/> Hella Store C.A
              </h6>
              <p>
               Empresa especializada en la venta de ropa y accesorios para damas y caballeros. Excelentes
               precios y calidad en un mismo lugar.  
              </p>
            </div>
            
            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              
              <h6 className="text-uppercase fw-bold mb-4">
                Enlaces
              </h6>
              <p>
                <a href="/register" style={{textDecoration: "none"}} className="text-reset">Registrar</a>
              </p>
              <p>
                <a href="/login" style={{textDecoration: "none"}} className="text-reset">Iniciar sesión</a>
              </p>
              <p>
                <a href="/categories" style={{textDecoration: "none"}} className="text-reset">Productos</a>
              </p>
              <p>
                <a href="/cart" style={{textDecoration: "none"}} className="text-reset">Carrito</a>
              </p>
            </div>
             
            
            
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
           
              <h6 className="text-uppercase fw-bold mb-4">Contacto</h6>
               <p><LocationOnIcon/>  AV Bolívar sector centro Achaguas, Estado Apure. Código postal 7002</p>
               
              <p><WhatsAppIcon/> 04268400223</p>
 
            </div>
            
          </div>
         
        </div>
      </section>
      
      <div className="text-center p-4"  >
        © HELLA STORE C.A. Todos los derechos reservados 
         
      </div>
     
    </footer></div>
  )
}

export default Banner 