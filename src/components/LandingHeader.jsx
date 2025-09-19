import { Link } from "react-router-dom";

const sections = [
  { id: "features", label: "Características" },
  { id: "pricing", label: "Precios" },
  { id: "faq", label: "FAQ" },
];

export default function Header({ activeSection = "" }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 py-4">
      <div className="max-w-6xl mx-auto flex items-center px-4">
        <span className="text-xl font-extrabold" style={{ color: "var(--color-primary)" }}>
          HourCheck
        </span>
        <nav className="hidden md:flex ml-10 space-x-8">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`pb-1 transition-all duration-500 border-b-2 ${
                activeSection === section.id
                  ? "border-[#234e63] text-[#234e63]"
                  : "border-transparent"
              }`}
              style={{
                fontWeight: "normal",
              }}
            >
              {section.label}
            </a>
          ))}
        </nav>
        <div className="flex-1" />
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="border border-[#234e63] text-[#234e63] px-4 py-2 rounded transition hover:bg-[#e6f1f1] text-sm font-semibold"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="bg-[#234e63] text-white px-4 py-2 rounded transition hover:bg-[#1d9796] text-sm font-semibold"
          >
            Regístrate
          </Link>
        </div>
      </div>
    </header>
  );
}