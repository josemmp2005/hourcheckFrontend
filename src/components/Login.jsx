import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import API_BASE_URL from "../config/api.js";
import loginImage from "../assets/login-image.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado
  const navigate = useNavigate();
  const invitationToken = localStorage.getItem("invitation-token");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
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
    <section className="min-h-screen flex items-center justify-center p-5 lg:justify-around" style={{ backgroundImage: `url(${loginImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

      <div className="hidden lg:block mb-20">
        <h1 className=" text-6xl font-bold text-white">HourCheck</h1>
        <ol className="mt-10 flex flex-col gap-5 list-disc list-inside max-w-xl">
          <li className="text-gray-300 text-xl">El futuro del control horario</li>
          <li className="text-gray-300 leading-relaxed text-xl">Simplifica la gestión de horarios de tu empresa con nuestra plataforma intuitiva y segura.</li>
        </ol>
          
      </div>

      <div className="card-content bg-white/50 backdrop-blur-md rounded-xl shadow-xl/30 p-5 flex flex-col items-center">

        <div className="logo-container mt-10">
          <img className="w-25 h-25 rounded-full object-cover" src={logo} alt="logo" />
          <p className="text-center text-lg font-bold text-primary lg:hidden">HourCheck</p>
          <p className="hidden text-center text-lg font-bold text-primary lg:block">Login</p>
          
        </div>

        <form className="form flex flex-col items-center w-full lg:p-8 lg:pt-0" onSubmit={handleLogin}>
          <div className="input-container flex flex-col mt-20 mb-10 rounded-md w-full pl-10 pr-10">
            <input
              className="input bg-none border-b-1 border-secondary p-2 text-lg focus:outline-none w-full pr-10"
              type="email"
              id="email"
              placeholder="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            {/* Campo de contraseña con botón para mostrar/ocultar */}
            <div className="relative">
              <input
                className="input bg-none border-b-1 border-secondary p-2 text-lg focus:outline-none w-full pr-10"
                type={showPassword ? "text" : "password"}
                id="password_hash"
                placeholder="password"
                value={passwordHash}
                onChange={e => setPasswordHash(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  // Icono de ojo cerrado (ocultar)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  // Icono de ojo abierto (mostrar)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm mb-2">{error}</div>
          )}
          <div className="button-container flex flex-col">
            <button className="p-2 rounded-md bg-primary hover:bg-secondary" type="submit">
              <p className="text-l text-white" >Iniciar sesión</p>
            </button>
            <div className="mt-5 flex flex-col items-center">
              <GoogleLogin
                onSuccess={credentialResponse => {
                  fetch(`${API_BASE_URL}/users/login/google`, {
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
            <p className="text-l text-primary">¿No tienes una cuenta?</p>
            <Link to="/register" className="link text-secondary hover:text-primary  no-underline">Regístrate</Link>
          </div>
        </form>
      </div>
    </section>
  );
}