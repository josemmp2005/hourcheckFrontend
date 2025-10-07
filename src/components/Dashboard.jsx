import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import API_BASE_URL from '../config/api.js';
import Toolbar from './Toolbar.jsx';
import timerIcon from '../assets/timer-icon.svg';

// Solo importa Recharts directamente
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role_id");
    const companyId = localStorage.getItem("company_id");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [dailyCode, setDailyCode] = useState("");

    // Datos para las gráficas
    const performanceData = [
        { name: 'Lun', value: 85 },
        { name: 'Mar', value: 78 },
        { name: 'Mié', value: 91 },
        { name: 'Jue', value: 88 },
        { name: 'Vie', value: 93 },
        { name: 'Sáb', value: 76 },
        { name: 'Dom', value: 82 }
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
        if (role === "5") {
            const fetchAndGenerateQR = async () => {
                const data = await getDailyCode();
                if (data && data.code) {
                    setDailyCode(data.code);
                    generateQR(data.code);
                }
            };
            fetchAndGenerateQR();
        }
    }, [role]);

    // QR Generator for role 5
    if (role === "5") {
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

    return (
        <section className="lg:flex min-h-screen bg-gray-100">
            <Header />
            <div className="w-full lg:ml-64 p-6">
                <div className="p-6 flex justify-between items-center border border-gray-400 rounded-xl shadow-md m-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/clock-in')}>
                    <p>Ultimo Clock In a las XX:XXh </p>
                    <img src={timerIcon} alt="Timer Icon" />
                </div>
                <div className="p-6 flex justify-between items-center border border-gray-400 rounded-xl shadow-md m-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/break')}>
                    <p>Break </p>
                    <img src={timerIcon} alt="Timer Icon" />
                </div>
                <div className="p-6 flex justify-between items-center border border-gray-400 rounded-xl shadow-md m-6">
                    <p>Total Horas Diarias</p>
                </div>      
                
                {/* Gráficas con Recharts - manteniendo tu estilo actual */}
                <div className="grid gap-6 md:grid-cols-2 mt-8">
                    {/* Gráfica de área - Rendimiento semanal */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6">
                        <h3 className="text-lg font-semibold mb-2">Rendimiento Semanal</h3>
                        <p className="text-gray-600 text-sm mb-4">Productividad de los últimos 7 días</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10b981"
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfica circular - Distribución de horas */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-400 p-6">
                        <h3 className="text-lg font-semibold mb-2">Distribución de Horas</h3>
                        <p className="text-gray-600 text-sm mb-4">Tiempo trabajado hoy</p>
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
            <Toolbar />
        </section>
    );
}