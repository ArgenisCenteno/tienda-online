import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const PasswordUpdate = () => {
  //CONTEXTO
  const [auth, setAuth] = useAuth();
  const [shown, setShown] = useState(false);
  //ESTADOS
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  //OBTENER USUARIO
  useEffect(() => {
    const { email, name, phone, address } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);

  // FUNCIÓN DE FORMULARIO 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar que la nueva contraseña y la repetición de la contraseña sean iguales
    if (password !== repeatPassword) {
       toast.error("La nueva contraseña y la repetición de contraseña no coinciden");
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@$!%*#?&.,¡¿])[A-Za-z\d\-_@$!%*#?&.,¡¿.]{8,}$/;

    if (!password || !passwordRegex.test(password)) {
      setPasswordError(
        "La clave debe tener al menos 8 caracteres y contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (- _ @ $ ! % * # ? &)"
      );
      return;
    } else {
      setPasswordError("");
    }

    try {
      const { data } = await axios.put("/api/v1/auth/update-password", {
        email,  
        password, 
        currentPassword
      });
      if (data?.errro) {
        toast.error(data?.error);
      } else {
        
        toast.success("Clave actualizada correctamente");
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error");
    }
  };

  useEffect(() => {
    validatePassword();
  }, [password]);
   // Validar password
   const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@$!%*#?&.,¡¿])[A-Za-z\d\-_@$!%*#?&.,¡¿.]{8,}$/;

    if (!password || !passwordRegex.test(password)) {
      setPasswordError(
        "La clave debe tener al menos 8 caracteres y contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (- _ @ $ ! % * # ? &)"
      );
    } else {
      setPasswordError("");
    } 
  };
  return (
    <Layout title={"Perfil"}>
      <div className="container-fluid-4 p-3 dashboard">
        <div className="row  mt">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-8">
            <div className="form-container" style={{ marginTop: "10px" }}>
              <form onSubmit={handleSubmit}>
                <h4 className="title mt-4 mb-4">Actualizar clave</h4>
                
                <div className="mb-3 "style={{ position: "relative" }} >
                  <span> <strong>Clave actual</strong> </span>
  <input
    type={shown.currentPassword ? "text" : "password"}
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    className="form-control"
    placeholder="Ingresa tu contraseña actual"
  />
  {/* Botón para mostrar/ocultar la contraseña actual */}
  <button
    type="button"
    style={{
      backgroundColor: "transparent",
      border: "none",
      color: "#059669",
      marginRight: "8px",
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
    }}
    onClick={() => setShown({ ...shown, currentPassword: !shown.currentPassword })}
  >
    {shown.currentPassword ? <FaEye /> : <FaEyeSlash />}
  </button>
</div>

<div className="mb-3" style={{ position: "relative" }}>
<span> <strong>Nueva clave</strong> </span>
  <input
    type={shown.password ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="form-control" 
    placeholder="Ingresa tu nueva contraseña"
  />
  {/* Botón para mostrar/ocultar la nueva contraseña */}
  <button
    type="button"
    style={{
      backgroundColor: "transparent",
      border: "none",
      color: "#059669",
      marginRight: "8px",
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
    }}
    onClick={() => setShown({ ...shown, password: !shown.password })}
  >
    {shown.password ? <FaEye /> : <FaEyeSlash />}
  </button>
 
</div>
{passwordError && (
                      <small
                        className="text-danger mb-4"
                        style={{ display: "block", marginTop: "4px" }}
                      >
                        {passwordError}
                      </small>
                    )}

<div className="mb-3" style={{ position: "relative" }}>
<span> <strong>Confirmar clave</strong> </span>
  <input
    type={shown.repeatPassword ? "text" : "password"}
    value={repeatPassword}
    onChange={(e) => setRepeatPassword(e.target.value)}
    className="form-control" 
    placeholder="Repite tu nueva contraseña"
  />
  {/* Botón para mostrar/ocultar la repetición de contraseña */}
  <button
    type="button"
    style={{
      backgroundColor: "transparent",
      border: "none",
      color: "#059669",
      marginRight: "8px",
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
    }}
    onClick={() => setShown({ ...shown, repeatPassword: !shown.repeatPassword })}
  >
    {shown.repeatPassword ? <FaEye /> : <FaEyeSlash />}
  </button>
</div>

 
                 

                <button type="submit" className="btn btn-primary ingresar">
                  Actualizar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PasswordUpdate;
