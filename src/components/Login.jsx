import google from "../assets/google.svg";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <>
      <div className="login-wrapper bg-primary flex flex-col items-center h-screen w-screen">
        <Link to="/" className="home-button bg-secundary p-2 rounded-md" href="/home">
        <h1 className="title text-l text-white mt-10">HourCheck</h1>
        </Link>
        <div className="card bg-white w-8/10 h-8/10 border-2 rounded-2xl mt-10 pb-10 max-w-[400px] max-h-fit">
          <div className="card-content">
            <div className="photo pt-10 pb-5 flex justify-center">
              <img
                className="w-15 h-15 rounded-full border-2"
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Foto de perfil"
              />
            </div>
            <div className="subtitle flex justify-center">
              <h2 className="text-l">Iniciar sesión en HourCheck</h2>
            </div>
            <div className="form flex flex-col items-center">
              <div className="input-container flex flex-col mt-20 mb-10">
                <label className="text-l" htmlFor="email">
                  Correo
                </label>
                <input
                  className="input bg-gray-300 border-2 rounded-md p-2"
                  type="email"
                  id="email"
                  placeholder="Correo"
                />
                <label className="text-l" htmlFor="password">
                  Contraseña
                </label>
                <input
                  className="input bg-gray-300 border-2 rounded-md p-2"
                  type="password"
                  id="password"
                  placeholder="Contraseña"
                />
              </div>
              <div className="button-container flex flex-col">
                <button className="log-in-button bg-gray-300 border-2 p-2 rounded-md mt-10">
                  Iniciar sesión
                </button>
                <Link className="sign-up-button bg-gray-300 border-2 p-2 rounded-md mt-5 flex align-center">
                  <img src={google} alt="Google" className="w-5 h-5 mt-0.5 mr-2" />
                  Continuar con Google
                </Link>
              </div>
              <div className="register-container items-center flex gap-1 mt-10">
                <p className="text-l">¿No tienes una cuenta?</p>
                <Link
                  to="/register"
                  className="link"
                >
                  Regístrate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
