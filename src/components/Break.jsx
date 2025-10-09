import Header from './Header';
import Toolbar from './Toolbar';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api.js';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function Break() {

    const breakStatusChecked = useRef(false);
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('company_id');
    const navigate = useNavigate();
    const [breakStatus, setBreakStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [canTakeBreak, setCanTakeBreak] = useState(false);
    const porcentaje = 70; // ← controla el valor mostrado (0–100)

    const data = [
        {
            name: 'Progreso',
            uv: porcentaje,
            fill: '#00C49F', // color del progreso
        },
    ];


    const checkBreakStatus = async () => {
        if (breakStatusChecked.current) return;

        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/breaks/status/${companyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();

            if (response.ok) {
                setBreakStatus(data.onBreak ? 'onBreak' : 'notOnBreak');
                setCanTakeBreak(true);
                breakStatusChecked.current = true;
            } else {
                // Si hay error, probablemente no hay clock-in activo
                if (data.message === "No active clock-in found") {
                    setCanTakeBreak(false);
                    setBreakStatus('noClockIn');
                } else {
                    throw new Error(data.message || "Failed to fetch break status");
                }
            }
        } catch (error) {
            console.error('Error fetching break status:', error);
            setCanTakeBreak(false);
            setBreakStatus('error');
        } finally {
            setIsLoading(false);
        }
    }

    const startBreak = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/break/start/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ companyId })
            });
            const data = await response.json();
            if (response.ok) {
                alert("Break registrado correctamente a las " + data.message);
                navigate("/dashboard");
            } else {
                alert(data.message || "Error al iniciar el break");
            }
        } catch (error) {
            console.error('Error starting break:', error);
            alert("Error al iniciar el break");
        }
    }

    const endBreak = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/break/end/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ companyId })
            });
            const data = await response.json();
            if (response.ok) {
                alert("Break finalizado correctamente a las " + data.message);
                navigate("/dashboard");
            } else {
                alert(data.message || "Error al finalizar el break");
            }
        } catch (error) {
            console.error('Error ending break:', error);
            alert("Error al finalizar el break");
        }
    }

    useEffect(() => {
        checkBreakStatus();
    }, []);

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-indigo-100 flex items-center justify-center">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Verificando estado...</p>
                    </div>
                </div>
            </>
        );
    }

    if (!canTakeBreak) {
        return (
            <>
                <Header />
                <div className=" flex items-center justify-center pt-20">
                    <div
                        style={{
                            width: 200,
                            height: 200,
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Porcentaje encima del círculo */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -60%)', // sube el texto ligeramente
                                fontSize: '28px',
                                fontWeight: 'bold',
                                color: '#333',
                                zIndex: 2,
                            }}
                        >
                            {porcentaje}%
                        </div>

                        {/* Gráfico circular */}
                        <ResponsiveContainer>
                            <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="70%"
                                outerRadius="100%"
                                barSize={20}
                                data={data}
                                startAngle={90}
                                endAngle={-270}
                            >
                                {/* Círculo gris de fondo */}
                                <RadialBar
                                    data={[{ uv: 100 }]}
                                    dataKey="uv"
                                    fill="#e0e0e0"
                                    clockWise
                                    cornerRadius={10}
                                />
                                {/* Progreso de color */}
                                <RadialBar
                                    dataKey="uv"
                                    clockWise
                                    cornerRadius={10}
                                    fill={data[0].fill}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <Toolbar />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    {breakStatus === 'notOnBreak' && (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Iniciar Descanso</h2>
                            <p className="text-gray-600 mb-6">¿Quieres iniciar tu descanso ahora?</p>
                            <button
                                onClick={startBreak}
                                className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 transition-colors"
                            >
                                Iniciar Descanso
                            </button>
                        </>
                    )}

                    {breakStatus === 'onBreak' && (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Finalizar Descanso</h2>
                            <p className="text-gray-600 mb-6">Estás actualmente en descanso. ¿Quieres finalizarlo?</p>
                            <button
                                onClick={endBreak}
                                className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-red-700 transition-colors"
                            >
                                Finalizar Descanso
                            </button>
                        </>
                    )}
                </div>
            </div>
            <Toolbar />
        </>
    );
}