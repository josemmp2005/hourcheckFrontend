import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const invitationToken = localStorage.getItem("invitation-token");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password_hash: passwordHash }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();

      // Decodificar el token para comprobar el rol
      alert("Acceso correcto");
      localStorage.setItem("token", data.token);
      navigate("/select-company");
    } catch (error) {
      setError(error.message || "Error al iniciar sesión");
    }
  };

  return (
    <>
      <div className={`login-wrapper bg-primary flex flex-col items-center h-screen w-screen`}>
        <Link
          to="/"
          className="home-button bg-secundary p-2 rounded-md"
          href="/home"
        >
          <h1 className="title text-2 xl font-bold text-white mt-10">HourCheck</h1>
        </Link>
        <div className="card bg-white w-8/10 h-8/10 border-2 border-gray-300 rounded-2xl mt-10 pb-10 max-w-[350px] max-h-fit">
          <div className="card-content">
            <div className="photo pt-10 pb-5 flex justify-center">
                <img
                  className="w-20 h-20 rounded-full object-cover"
                  src={logo}
                  alt="Foto de perfil"
                />
            </div>
            <div className="subtitle flex justify-center">
              <h2 className="text-l font-semibold">
                Iniciar sesión
              </h2>
            </div>
            <form className="form flex flex-col items-center w-full" onSubmit={handleLogin}>
              <div className="input-container flex flex-col mt-20 mb-10 rounded-md w-full pl-10 pr-10">
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
                  type="password"
                  id="password_hash"
                  placeholder="Contraseña"
                  value={passwordHash}
                  onChange={e => setPasswordHash(e.target.value)}
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm mb-2">{error}</div>
              )}
              <div className="button-container flex flex-col">
                <button className="p-2 rounded-md" type="submit" style={{ backgroundColor: "var(--color-primary)" }}>
                  <p className="text-l text-white" >Iniciar sesión</p>
                </button>
                <div className="mt-5 flex flex-col items-center">
                  <GoogleLogin
                    onSuccess={credentialResponse => {
                      fetch('http://localhost:3000/users/login/google', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id_token: credentialResponse.credential })
                      })
                        .then(res => res.json())
                        .then(data => {
                          if (data.token) {
                            localStorage.setItem('token', data.token);
                            if (invitationToken) {
                              navigate(`/invitation?token=${invitationToken}`);
                              return;
                            }
                            navigate('/select-company');
                          } else {
                            setError('Error al iniciar sesión con Google');
                          }
                        })
                        .catch(() => setError('Error al iniciar sesión con Google'));
                    }}
                    onError={() => setError('Error al iniciar sesión con Google')}
                  />
                </div>
              </div>
              <div className="register-container items-center flex gap-1 mt-10">
                <p className="text-l">¿No tienes una cuenta?</p>
                <Link to="/register" className="link">
                  Regístrate
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
