import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout>
      <div className="container-fluid   p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-100 p-3">
              <h5> Administrador : <br/> </h5>
              <p>{auth?.user?.name} </p> 
              <h5> Email : <br/>  </h5>
               <p>{auth?.user?.email} </p> 
              <h5> Telefono : <br/></h5> 
              <p> {auth?.user?.phone} </p>
             
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
