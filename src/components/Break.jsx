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
                    <p>asd</p>
                </div>
                <Toolbar />
            </>
        );
    }

    return (
        <section className="pt-25 bg-background min-h-screen">
            <Header />
            <div className="flex flex-col items-center">
                <div className="p-8 pt-0 <max-w-md w-full text-center">
                    <div className="relative flex items-center justify-center w-52 h-52 mx-auto mb-6">
                        {/* Porcentaje encima del círculo */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-3xl font-bold text-gray-800 z-1">
                            {porcentaje}%
                        </div>
                        {/* Gráfico circular */}
                        <div className="w-full h-full">
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
                            <p>Descanso empezo a las XX:XXh</p>
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

                <div className='w-full m-5 max-w-2xl p-4 sm:px-8 mt-10 rounded-xl flex flex-col'>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Summary</h2>
                    <div className='w-full flex justify-around mb-4'>
                        <div className='flex flex-col  bg-blue-100 p-4 rounded-xl w-1/2 mr-2'>
                            <h3 className="text-lg w-full">Work Time</h3>
                            <p className="text-gray-700 text-xl font-bold">Xh  XXm</p>
                        </div>
                        <div className='flex flex-col  bg-blue-100 p-4 rounded-xl w-1/2 ml-2'>
                            <h3 className="text-lg w-full">Break Time</h3>
                            <p className="text-gray-700 text-xl font-bold">XXm  XXs</p>
                        </div>
                    </div>
                </div>

                <div className='w-full m-5 max-w-2xl p-4 pt-0 sm:px-8 rounded-xl flex flex-col mb-20'>
                    <div className='w-full flex justify-between items-center mb-4'>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Break History</h2>
                        <p className="text-blue-400 hover:underline cursor-pointer">See All</p>
                    </div>
                    <div className='flex items-center justify-between mb-4 w-full bg-white p-4 rounded-xl'>
                        <div>
                            <h3 className="text-lg font-bold">Lunch Break</h3>
                            <p className="text-gray-700">Xh  XXm</p>
                        </div>
                        <p className="text-gray-500">XXm in</p>
                    </div>
                    <div className='flex items-center justify-between mb-4 w-full bg-white p-4 rounded-xl'>
                        <div>
                            <h3 className="text-lg font-bold">Lunch Break</h3>
                            <p className="text-gray-700">Xh  XXm</p>
                        </div>
                        <p className="text-gray-500">XXm in</p>
                    </div>
                </div>
            </div>
            <Toolbar />
        </section>
    );
}