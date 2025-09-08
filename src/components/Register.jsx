import google from "../assets/google.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Register() {º
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [confirmPasswordHash, setConfirmPasswordHash] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password_hash !== confirmpassword_hash) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password_hash }),
      });

      if (!response.ok) {
        throw new Error("Error al registrarse");
      }

      const data = await response.json();
      alert("Registro correcto");

      const dataLogin = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password_hash }),
      });
      if (!dataLogin.ok) {
        throw new Error("Credenciales inválidas");
      }
      const loginResponse = await dataLogin.json();
      localStorage.setItem("token", loginResponse.token);
      navigate("/select-company");


    } catch (error) {
      setError(error.message || "Error al registrarse");
    }

  };

  return (
    <>
      <div className="login-wrapper bg-primary flex flex-col items-center h-screen w-screen">
        <Link
          to="/"
          className="home-button bg-secundary p-2 rounded-md"
          href="/home"
        >
          <h1 className="title text-l font-bold text-white mt-10">HourCheck</h1>
        </Link>
        <div className="card bg-white w-8/10 h-8/10 border-2 border-gray-300 rounded-2xl mt-10 pb-10 max-w-[350px] max-h-fit">
          <div className="card-content">
            <div className="photo pt-10 pb-5 flex justify-center">
              <img
                className="w-15 h-15 rounded-full border-2"
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Foto de perfil"
              />
            </div>
            <div className="subtitle flex justify-center">
              <h2 className="text-l font-semibold">Regístrate en HourCheck</h2>
            </div>
            <form className="form flex flex-col items-center w-full" onSubmit={handleRegister}>
              <div className="input-container flex flex-col mt-20 mb-10 rounded-md w-full pl-10 pr-10">
                <input
                  className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                  type="text"
                  id="name"
                  placeholder="Elige un nombre"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <input
                  className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                  type="email"
                  id="email"
                  placeholder="Correo"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <input
                  className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                  type="password_hash"
                  id="password_hash"
                  placeholder="Contraseña"
                  value={password_hash}
                  onChange={e => setpassword_hash(e.target.value)}
                />
                <input
                  className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                  type="password_hash"
                  id="confirm-password_hash"
                  placeholder="Contraseña"
                  value={confirmpassword_hash}
                  onChange={ e => setConfirmpassword_hash(e.target.value)}
                />
              </div>
              <div className="button-container flex flex-col">
                <button className="btn">Regístrate</button>
                <Link className="google-button bg-gray-100 p-3 rounded-md mt-5 flex align-center hover:bg-gray-200 transition ease-in-out">
                  <img
                    src={google}
                    alt="Google"
                    className="w-5 h-5 mt-0.5 mr-2"
                  />
                  Continuar con Google
                </Link>
              </div>
              <div className="register-container items-center flex gap-1 mt-10">
                <p className="text-l">¿Ya tienes una cuenta?</p>
                <Link to="/login" className="link">
                  Inicia sesión
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
