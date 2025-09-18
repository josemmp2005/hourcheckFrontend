import Header from "./LandingHeader.jsx";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <section className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-xl w-full">
          <h1 className="text-4xl font-bold text-blue-700 mb-4 text-center">
            Bienvenido a HourCheck
          </h1>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Gestiona tus horas laborales, fichajes y equipos de forma sencilla y
            moderna.
          </p>
          <div className="flex gap-4">
            <a
              href="/register"
              className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-600 transition-colors font-semibold"
            >
              Regístrate gratis
            </a>
            <a
              href="/login"
              className="bg-white border border-blue-500 text-blue-500 px-6 py-3 rounded-xl shadow hover:bg-blue-50 transition-colors font-semibold"
            >
              Inicia sesión
            </a>
          </div>
        </section>
      </main>
    </>
  );
}


