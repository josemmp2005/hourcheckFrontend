import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import API_BASE_URL from '../config/api.js';
import Toolbar from './Toolbar.jsx';
import timerIcon from '../assets/icons/timer-icon.svg';
import BackgroundLogo from './BackgroundLogo.jsx';

// Solo importa Recharts directamente
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const companyId = localStorage.getItem("company_id");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [dailyCode, setDailyCode] = useState("");
  const [serverTime, setServerTime] = useState(null);


  const getServerTime = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/server-time`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setServerTime(new Date(data.timestamp));
      }
    } catch (error) {
      console.error("Error fetching server time:", error);
      // Fallback a hora local si falla
      setServerTime(new Date());
    }
  };

  useEffect(() => {
    // Obtener hora inicial del servidor
    getServerTime();

    // Actualizar cada segundo
    const timeInterval = setInterval(() => {
      if (serverTime) {
        setServerTime(prev => new Date(prev.getTime() + 1000));
      }
    }, 1000);

    // Sincronizar con servidor cada 5 minutos
    const syncInterval = setInterval(() => {
      getServerTime();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(syncInterval);
    };
  }, [serverTime]);


  // Datos para las gráficas
  const monthlyPerformanceData = [
    { mes: 'Ene', rendimiento: 78 },
    { mes: 'Feb', rendimiento: 82 },
    { mes: 'Mar', rendimiento: 75 },
    { mes: 'Abr', rendimiento: 88 },
    { mes: 'May', rendimiento: 91 },
    { mes: 'Jun', rendimiento: 85 },
    { mes: 'Jul', rendimiento: 93 },
    { mes: 'Ago', rendimiento: 87 },
    { mes: 'Sep', rendimiento: 90 },
    { mes: 'Oct', rendimiento: 94 },
    { mes: 'Nov', rendimiento: 89 },
    { mes: 'Dic', rendimiento: 86 }
  ];

  const weeklyPerformanceData = [
    { semana: 'Sem 1', rendimiento: 88, horas: 42 },
    { semana: 'Sem 2', rendimiento: 92, horas: 45 },
    { semana: 'Sem 3', rendimiento: 85, horas: 38 },
    { semana: 'Sem 4', rendimiento: 94, horas: 47 }
  ];

  const hoursData = [
    { name: 'Trabajadas', value: 85, color: '#10b981' },
    { name: 'Break', value: 10, color: '#f59e0b' },
    { name: 'Disponible', value: 5, color: '#ef4444' }
  ];

  const getDailyCode = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/daily-singing-code/${companyId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch daily singing code");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching daily singing code:", error);
    }
  };

  const generateQR = async (text) => {
    try {
      const url = await QRCode.toDataURL(text);
      setQrCodeUrl(url);
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  };

  useEffect(() => {
    if (!companyId) {
      navigate('/select-company');
      return;
    }
    const checkRole = () => {
      const storedRole = localStorage.getItem("role_id");

      if (storedRole) {
        setRole(storedRole);
        setIsLoading(false);

        // Si es role 5, generar QR
        if (storedRole === "5") {
          const fetchAndGenerateQR = async () => {
            const data = await getDailyCode();
            if (data && data.code) {
              setDailyCode(data.code);
              generateQR(data.code);
            }
          };
          fetchAndGenerateQR();
        }
      } else {
        // Si no hay role_id, esperar un poco y volver a intentar
        setTimeout(checkRole, 100);
      }
    };

    checkRole();
  }, []);

  // Mostrar loading mientras carga el role
  if (isLoading || !role) {
    return renderLoading();
  }

  // Una vez tenemos el role, renderizar el dashboard correspondiente
  switch (role) {
    case "1":
      return renderSuperAdminDashboard();
    case "2":
      return renderAdminDashboard();
    case "3":
      return renderManagerDashboard();
    case "4":
      return renderEmployeeDashboard();
    case "5":
      return renderQRDashboard();
    default:
      return renderLoading();
  }

  function renderQRDashboard() {
    return (
      <section className="lg:flex min-h-screen">
        <Header />
        <div className="h-100 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 lg:w-full" >
          <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full">
            <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
              📱 Código QR Diario
            </h2>

            {qrCodeUrl ? (
              <div className="text-center">
                <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Código:</strong> {dailyCode}
                </p>
                <p className="text-gray-500 text-xs">
                  Los empleados deben escanear este código para registrar su entrada
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generando código QR...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  function renderEmployeeDashboard() {
    return (
      <section className="lg:flex min-h-screen bg-background">
        <Header />
        <div className="w-full pt-20 lg:pl-70 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:justify-around lg:items-center mb-6">
            <div className="flex-1 flex flex-col h-100 place-content-around">
              <div className="p-7 flex bg-white justify-between items-center border border-gray-400 rounded-xl shadow-md m-2 mb-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <p className="text-xl font-semibold text-secondary">
                  {serverTime ? serverTime.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }) : 'Cargando...'}
                </p>
                <p className="text-sm text-gray-500">
                  {serverTime ? serverTime.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''}
                </p>
              </div>
              <div className="p-7 flex bg-white justify-between items-center border border-gray-400 rounded-xl shadow-md m-2 mb-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/clock')}>
                <p>Ultimo Clock In a las XX:XXh </p>
                <img src={timerIcon} alt="Timer Icon" />
              </div>
              <div className="p-7 bg-white flex justify-between items-center border border-gray-400 rounded-xl shadow-md m-2 mb-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/break')}>
                <p>Break </p>
                <img src={timerIcon} alt="Timer Icon" />
              </div>
            </div>

            <div className="flex-2 flex flex-col sm:flex-row lg:justify-center gap-5 lg:items-center m-2">
              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={hoursData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {hoursData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={hoursData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {hoursData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-center gap-5 lg:items-center mb-6 m-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
              <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>
              <p className="text-gray-600 text-sm mb-4">Comparativa de productividad por meses</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Rendimiento']}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Bar
                    dataKey="rendimiento"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
              <h3 className="text-lg font-semibold mb-2">Rendimiento Semanal</h3>
              <p className="text-gray-600 text-sm mb-4">Productividad por semanas del mes actual</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'rendimiento' ? `${value}%` : `${value}h`,
                      name === 'rendimiento' ? 'Rendimiento' : 'Horas Trabajadas'
                    ]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar
                    dataKey="rendimiento"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-around lg:items-center gap-5 m-2">
            <div className="flex flex-col sm:flex-row lg:justify-center gap-5 lg:items-center w-full">
              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Semanal</h3>
                <p className="text-gray-600 text-sm mb-4">Productividad por semanas del mes actual</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semana" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'rendimiento' ? `${value}%` : `${value}h`,
                        name === 'rendimiento' ? 'Rendimiento' : 'Horas Trabajadas'
                      ]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar
                      dataKey="rendimiento"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full ">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Semanal</h3>
                <p className="text-gray-600 text-sm mb-4">Productividad por semanas del mes actual</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semana" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'rendimiento' ? `${value}%` : `${value}h`,
                        name === 'rendimiento' ? 'Rendimiento' : 'Horas Trabajadas'
                      ]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar
                      dataKey="rendimiento"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">

              <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>
              <p className="text-gray-600 text-sm mb-4">Comparativa de productividad por meses</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Rendimiento']}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Bar
                    dataKey="rendimiento"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <Toolbar />
      </section>
    );
  }

  function renderManagerDashboard() {
    return (
      <section className="lg:flex min-h-screen bg-background">
        <Header />
        <div className="w-full p-6 lg:pl-70">
          <div className="flex flex-col lg:flex-row lg:justify-around lg:items-center mb-6">
            <div className="flex-1 ">
              <div className="p-7 flex bg-white justify-between items-center border border-gray-400 rounded-xl shadow-md m-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <p className="text-xl font-semibold text-secondary">
                  {serverTime ? serverTime.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }) : 'Cargando...'}
                </p>
                <p className="text-sm text-gray-500">
                  {serverTime ? serverTime.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''}
                </p>
              </div>
              <div className="p-7 flex bg-white justify-between items-center border border-gray-400 rounded-xl shadow-md m-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/clock-in')}>
                <p>Ultimo Clock In a las XX:XXh </p>
                <img src={timerIcon} alt="Timer Icon" />
              </div>
              <div className="p-7 bg-white flex justify-between items-center border border-gray-400 rounded-xl shadow-md m-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/break')}>
                <p>Break </p>
                <img src={timerIcon} alt="Timer Icon" />
              </div>
            </div>

            <div className="flex-2 flex flex-col sm:flex-row lg:justify-center gap-5 lg:items-center">
              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={hoursData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {hoursData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={hoursData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {hoursData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-center gap-5 lg:items-center mb-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
              <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>
              <p className="text-gray-600 text-sm mb-4">Comparativa de productividad por meses</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Rendimiento']}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Bar
                    dataKey="rendimiento"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
              <h3 className="text-lg font-semibold mb-2">Rendimiento Semanal</h3>
              <p className="text-gray-600 text-sm mb-4">Productividad por semanas del mes actual</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'rendimiento' ? `${value}%` : `${value}h`,
                      name === 'rendimiento' ? 'Rendimiento' : 'Horas Trabajadas'
                    ]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar
                    dataKey="rendimiento"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-around lg:items-center gap-5">
            <div className="flex flex-col sm:flex-row lg:justify-center gap-5 lg:items-center w-full">
              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Semanal</h3>
                <p className="text-gray-600 text-sm mb-4">Productividad por semanas del mes actual</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semana" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'rendimiento' ? `${value}%` : `${value}h`,
                        name === 'rendimiento' ? 'Rendimiento' : 'Horas Trabajadas'
                      ]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar
                      dataKey="rendimiento"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Semanal</h3>
                <p className="text-gray-600 text-sm mb-4">Productividad por semanas del mes actual</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semana" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'rendimiento' ? `${value}%` : `${value}h`,
                        name === 'rendimiento' ? 'Rendimiento' : 'Horas Trabajadas'
                      ]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar
                      dataKey="rendimiento"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">

              <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>
              <p className="text-gray-600 text-sm mb-4">Comparativa de productividad por meses</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Rendimiento']}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Bar
                    dataKey="rendimiento"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <Toolbar />
      </section>
    );
  }

  function renderLoading() {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background">
        <Header />
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-6 border-secondary"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </section>
    );
  }

  function renderSuperAdminDashboard() {
    return (
      <section className="lg:flex min-h-screen bg-background">
        <Header />
        <div className="w-full p-6 lg:pl-70">
          <div className="flex flex-col lg:flex-row lg:justify-around lg:items-center mb-6">
            <div className="flex-1 ">
              <div className="p-7 flex bg-white justify-between items-center border border-gray-400 rounded-xl shadow-md m-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <p className="text-xl font-semibold text-secondary">
                  {serverTime ? serverTime.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }) : 'Cargando...'}
                </p>
                <p className="text-sm text-gray-500">
                  {serverTime ? serverTime.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''}
                </p>
              </div>
              <div className="p-7 flex bg-white justify-between items-center border border-gray-400 rounded-xl shadow-md m-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/clock-in')}>
                <p>Ultimo Clock In a las XX:XXh </p>
                <img src={timerIcon} alt="Timer Icon" />
              </div>
              <div className="p-7 bg-white flex justify-between items-center border border-gray-400 rounded-xl shadow-md m-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/break')}>
                <p>Break </p>
                <img src={timerIcon} alt="Timer Icon" />
              </div>
            </div>

            <div className="flex-2 flex flex-col sm:flex-row lg:justify-center gap-5 lg:items-center">
              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={hoursData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {hoursData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={hoursData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {hoursData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-center gap-5 lg:items-center mb-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
              <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>
              <p className="text-gray-600 text-sm mb-4">Comparativa de productividad por meses</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Rendimiento']}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Bar
                    dataKey="rendimiento"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
              <h3 className="text-lg font-semibold mb-2">Rendimiento Semanal</h3>
              <p className="text-gray-600 text-sm mb-4">Productividad por semanas del mes actual</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'rendimiento' ? `${value}%` : `${value}h`,
                      name === 'rendimiento' ? 'Rendimiento' : 'Horas Trabajadas'
                    ]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar
                    dataKey="rendimiento"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-around lg:items-center gap-5">
            <div className="flex flex-col sm:flex-row lg:justify-center gap-5 lg:items-center w-full">
              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Semanal</h3>
                <p className="text-gray-600 text-sm mb-4">Productividad por semanas del mes actual</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semana" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'rendimiento' ? `${value}%` : `${value}h`,
                        name === 'rendimiento' ? 'Rendimiento' : 'Horas Trabajadas'
                      ]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar
                      dataKey="rendimiento"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Semanal</h3>
                <p className="text-gray-600 text-sm mb-4">Productividad por semanas del mes actual</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semana" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'rendimiento' ? `${value}%` : `${value}h`,
                        name === 'rendimiento' ? 'Rendimiento' : 'Horas Trabajadas'
                      ]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar
                      dataKey="rendimiento"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">

              <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>
              <p className="text-gray-600 text-sm mb-4">Comparativa de productividad por meses</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Rendimiento']}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Bar
                    dataKey="rendimiento"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <Toolbar />
      </section>
    );
  }

  function renderAdminDashboard() {
    return (
      <section className="lg:flex min-h-screen bg-background">
        <Header />
        <div className="w-full p-6 lg:pl-70">
          <div className="flex flex-col lg:flex-row lg:justify-around lg:items-center mb-6">
            <div className="flex-1 ">
              <div className="p-7 flex bg-white justify-between items-center border border-gray-400 rounded-xl shadow-md m-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <p className="text-xl font-semibold text-secondary">
                  {serverTime ? serverTime.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }) : 'Cargando...'}
                </p>
                <p className="text-sm text-gray-500">
                  {serverTime ? serverTime.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''}
                </p>
              </div>
              <div className="p-7 flex bg-white justify-between items-center border border-gray-400 rounded-xl shadow-md m-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/clock-in')}>
                <p>Ultimo Clock In a las XX:XXh </p>
                <img src={timerIcon} alt="Timer Icon" />
              </div>
              <div className="p-7 bg-white flex justify-between items-center border border-gray-400 rounded-xl shadow-md m-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/break')}>
                <p>Break </p>
                <img src={timerIcon} alt="Timer Icon" />
              </div>
            </div>

            <div className="flex-2 flex flex-col sm:flex-row lg:justify-center gap-5 lg:items-center">
              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={hoursData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {hoursData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={hoursData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {hoursData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-center gap-5 lg:items-center mb-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
              <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>
              <p className="text-gray-600 text-sm mb-4">Comparativa de productividad por meses</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Rendimiento']}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Bar
                    dataKey="rendimiento"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
              <h3 className="text-lg font-semibold mb-2">Rendimiento Semanal</h3>
              <p className="text-gray-600 text-sm mb-4">Productividad por semanas del mes actual</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'rendimiento' ? `${value}%` : `${value}h`,
                      name === 'rendimiento' ? 'Rendimiento' : 'Horas Trabajadas'
                    ]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar
                    dataKey="rendimiento"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-around lg:items-center gap-5">
            <div className="flex flex-col sm:flex-row lg:justify-center gap-5 lg:items-center w-full">
              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Semanal</h3>
                <p className="text-gray-600 text-sm mb-4">Productividad por semanas del mes actual</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semana" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'rendimiento' ? `${value}%` : `${value}h`,
                        name === 'rendimiento' ? 'Rendimiento' : 'Horas Trabajadas'
                      ]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar
                      dataKey="rendimiento"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">
                <h3 className="text-lg font-semibold mb-2">Rendimiento Semanal</h3>
                <p className="text-gray-600 text-sm mb-4">Productividad por semanas del mes actual</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semana" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'rendimiento' ? `${value}%` : `${value}h`,
                        name === 'rendimiento' ? 'Rendimiento' : 'Horas Trabajadas'
                      ]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar
                      dataKey="rendimiento"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6 w-full">

              <h3 className="text-lg font-semibold mb-2">Rendimiento Mensual</h3>
              <p className="text-gray-600 text-sm mb-4">Comparativa de productividad por meses</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Rendimiento']}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Bar
                    dataKey="rendimiento"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <Toolbar />
      </section>
    );
  }
}