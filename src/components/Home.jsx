import Header from "./LandingHeader.jsx";

export default function Home() {

  return (
    <>
      <Header />
      <main
        className="flex flex-col items-center justify-center min-h-[80vh]"
        style={{
          background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`
        }}
      >
        <section className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-xl w-full">
          <h1
            className="text-4xl font-bold mb-4 text-center"
            style={{ color: "var(--color-primary)" }}
          >
            Bienvenido a HourCheck
          </h1>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Gestiona tus horas laborales, fichajes y equipos de forma sencilla y
            moderna.
          </p>
          <div className="flex gap-4">
            <a
              href="/register"
              className="px-6 py-3 rounded-xl shadow font-semibold"
              style={{
                color: "white"
              }}
            >
              Regístrate gratis
            </a>
            <a
              href="/login"
              className="bg-white border px-6 py-3 rounded-xl shadow transition-colors font-semibold"
              style={{
                borderColor: "var(--color-primary)",
                color: "var(--color-primary)"
              }}
            >
              Inicia sesión
            </a>
          </div>
        </section>
      </main>
    </>
  );
}