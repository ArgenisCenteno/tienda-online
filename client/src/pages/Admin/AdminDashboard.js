import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import axios from "axios";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';


const AdminDashboard = () => {
  const [auth] = useAuth();
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Obtener los totales desde el servidor
    const getTotals = async () => {
      try {
        const responseProducts = await axios.get("/api/v1/auth/total-products");
        setTotalProducts(responseProducts.data.total);

        const responseOrders = await axios.get("/api/v1/auth/total-orders");
        setTotalOrders(responseOrders.data.total);

        const responseCategories = await axios.get("/api/v1/auth/total-categories");
        setTotalCategories(responseCategories.data.total);

        const responseUsers = await axios.get("/api/v1/auth/total-users");
        setTotalUsers(responseUsers.data.total);
      } catch (error) {
        console.log(error);
      }
    };

    getTotals();
  }, []);

  return (
    <Layout>
      <div className="container-fluid   p-3 dashboard admin-panel">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9 ">
            <div className="card w-100 p-3  mt-3">
              <h5>Administrador:</h5>
              <p>{auth?.user?.name}</p>
              <h5>Email:</h5>
              <p>{auth?.user?.email}</p>
              <h5>Telefono:</h5>
              <p>{auth?.user?.phone}</p>
            </div>

            <div className="row mt-4">
              <div className="col-md-3 mt-3">
                <div className="card">
                  <div className="card-body ">
                    <h5 className="card-title ">Total de Productos</h5>
                    <p className="card-text">{totalProducts}</p>
                    <Inventory2Icon/>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mt-3">
                <div className="card">
                  <div className="card-body  ">
                    <h5 className="card-title">Total de Órdenes</h5>
                    <p className="card-text">{totalOrders}</p> 
                    <CategoryIcon/>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mt-3">
                <div className="card">
                  <div className="card-body  ">
                    <h5 className="card-title">Total de Categorías</h5>
                    <p className="card-text">{totalCategories}</p>
                    <LoyaltyIcon/>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mt-3">
                <div className="card">
                  <div className="card-body  ">
                    <h5 className="card-title">Total de Usuarios</h5>
                    <p className="card-text">{totalUsers}</p>
                    <PeopleAltIcon/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
