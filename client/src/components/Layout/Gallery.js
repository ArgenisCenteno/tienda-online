import React from 'react'
import "../Layout/style/gallery.css"
import a from "../Layout/img/a.jpg"
import b from "../Layout/img/b.jpg"
import c from "../Layout/img/c.jpg"
import e from "../Layout/img/e.jpg"


const Gallery = () => {
  return (
    <div className="gallery"  >
    <section >
      <h2 className="titulo-seccion">¿Quienes somos?</h2>
      <h4 className='text-center p-4'>Somos una empresa especializada  en la venta de ropa   y accesorios para damas y caballeros.
      Contamos con excelentes precios, estamos ubicados  en la AV Bolívar sector centro Achaguas, Estado Apure.  
      </h4>
      <div className=" row d-flex justify-content-center  ">
          <div className="contenedor__4-columnas">
              <section className="column">
                  <img src={a}  alt="tarjeta-credito" width="250px" height="330px" />
                  
              </section>
              <section className="column">
                  <img src={b} alt="calidad" width="250px" height="330px"/>
                   
              </section>
              <section className="column">
                  <img src={c} alt="camion" width="250px" height="330px"/>
                   
              </section>
              <section className="column">
                  <img src={e} alt="ubicacion" width="250px" height="330px"/>
                  
              </section>
             
          </div>
      </div>
  </section>
  </div>
  )
}

export default Gallery