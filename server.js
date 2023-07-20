import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

//CONFIGURACION ENV
dotenv.config();

//CONEXION CON LA BASE DE DATOS
connectDB();

const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)

//LLAMAR A EXPRESS
const app = express();

//MIDLEWARES
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, './client/build')));

//RUTAS
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//REST API
app.use('*', function (req, res){ res.sendFile(path.join(__dirname, './client/build/index.html'));});

//PORT
const PORT = process.env.PORT || 8080;

//EJECUCIÓN
app.listen(PORT, () => {
  console.log(
    `Este servidor esta en modo ${process.env.DEV_MODE} corriendo en el puerto ${PORT}`.bgCyan
      .white
  );
});
