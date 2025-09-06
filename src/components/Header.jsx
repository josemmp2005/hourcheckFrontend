import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <header className="header-wrapper bg-primary h-20 flex items-center justify-center">
        <div className="header flex justify-between items-center w-11/12">
          <h1 className="header-title text-xl font-bold text-secondary">
            <Link to="/">
            <p>HourCheck</p>
            </Link>
            </h1>
          <div className="button-container flex gap-3">
            <Link to="/login" className="btn" >
              <p>Iniciar sesión</p>
            </Link>
            <Link to="/register" className="btn" href="/register">
              <p>Regístrate</p>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
