import Header from './Header';
import Toolbar from './Toolbar';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api.js';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import ErrorIcon from '../assets/icons/error-icon.svg';


export default function Break() {

    const breakStatusChecked = useRef(false);
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId || payload.id || payload.sub;
    const companyId = localStorage.getItem('company_id');
    const navigate = useNavigate();
    const [breakStatus, setBreakStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [canTakeBreak, setCanTakeBreak] = useState(false);
    const [minutesLeft, setMinutesLeft] = useState(60);
    const [workingMinutes, setWorkingMinutes] = useState();
    const [breakMinutes, setBreakMinutes] = useState(0);
    const [userShift, setUserShift] = useState(null);
    const [clockToday, setClockToday] = useState(0);
    const [lastBreaks, setLastBreaks] = useState(null);

    const porcentaje = userShift?.break_minutes && !isNaN(breakMinutes)
        ? Math.min(100, Math.round((breakMinutes / userShift.break_minutes) * 100))
        : 0;


    const data = [
        {
            name: 'Progreso',
            uv: porcentaje,
            fill: '#00C49F', // color del progreso
        },
    ];

    const getUserShift = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/shifts/${companyId}/employee/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();
            // console.log(data["shift"]);
            if (response.ok) {
                setUserShift(data["shift"] || null);
            } else {
                console.error("Error fetching user shift:", data.message);
            }
        } catch (error) {
            console.error('Error fetching user shift:', error);
        }
    }

    const getMinutesWorkToday = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/clock/minutes-today`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ company_id: Number(companyId) })
            });
            const data = await response.json();
            // console.log(data);
            if (response.ok) {
                setWorkingMinutes(data.totalMinutes || 0);
            } else {
                console.error("Error fetching today's work minutes:", data.message);
            }
        } catch (error) {
            console.error('Error fetching today\'s work minutes:', error);
        }
    }

    const getBreakMinutesToday = async (clockId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/breaks/minutes-today/${clockId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();
            // console.log(data);
            if (response.ok) {
                setBreakMinutes(data["totalMinutes"] || 0);
            } else {
                console.error("Error fetching today's break minutes:", data.message);
            }
        } catch (error) {
            console.error('Error fetching today\'s break minutes:', error);
        }
    }

    const getClockToday = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/clock/today`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ company_id: Number(companyId) })
            });
            const data = await response.json();
            // console.log(data["data"][0]);
            if (response.ok) {
                setClockToday(data["data"][0] || 0);
                getBreakMinutesToday(data["data"][0].id);


            } else {
                console.error("Error fetching today's clocks:", data.message);
            }
        } catch (error) {
            console.error('Error fetching today\'s clocks:', error);
        }
    }

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
                    setMinutesLeft(0);
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
            const response = await fetch(`${API_BASE_URL}/breaks/start/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ clock_in_id: Number(clockToday.id) })
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
            const response = await fetch(`${API_BASE_URL}/breaks/stop/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ clock_in_id: Number(clockToday.id) })
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

    const getLastBreaks = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/breaks/last-three`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();
            if (response.ok) {
                setLastBreaks(data["data"] || []);
            } else {
                console.error("Error fetching last breaks:", data.message);
            }
        } catch (error) {
            console.error('Error fetching last breaks:', error);
        }
    }

    useEffect(() => {
        checkBreakStatus();
        getMinutesWorkToday();
        getUserShift();
        getClockToday();
        getLastBreaks();


    }, []);

    if (isLoading) {
        return (
            <section className="min-h-screen flex items-center justify-center">
                <Header />
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4  mb-6 border-secondary"></div>
                    <p className="text-gray-600">Verificando estado...</p>
                </div>
                <Toolbar />
            </section>
        );
    }

    // if (!canTakeBreak) {
    //     return (
    //         <>
    //             <Header />
    //             <div className=" flex items-center justify-center pt-20">
    //                 <p>asd</p>
    //             </div>
    //             <Toolbar />
    //         </>
    //     );
    // }

    // console.log(canTakeBreak, breakStatus);

    return (
        <section className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="pt-20">
                <div className="p-8 pt-0 max-w-md w-full text-center mx-auto">
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
                    {
                        !canTakeBreak && (
                            <p>No puedes tomar un descanso en este momento.</p>
                        )
                    }

                    {breakStatus === 'notOnBreak' && (
                        <>
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
                            <button
                                onClick={endBreak}
                                className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-red-700 transition-colors"
                            >
                                Finalizar Descanso
                            </button>
                        </>
                    )}
                </div>


                <div className='p-4 m-5 sm:px-8 rounded-xl flex flex-col  bg-white shadow-lg pt-0'>
                    <h2 className="text-xl font-bold bg-white p-4 text-left w-full max-w-2xl">Resumen Diario</h2>
                    <div className='w-full flex justify-around mb-4'>
                        {
                            !canTakeBreak ? (
                                <div onClick={() => navigate("/clock")} className='flex flex-col items-center justify-center bg-gray-50 p-4 rounded-2xl w-full border border-gray-200 hover:shadow-md transition-shadow duration-300'>
                                    <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-gray-100">
                                        <img src={ErrorIcon} alt="Error" className="h-10 w-10 opacity-60" />
                                    </div>
                                    <h3 className="text-gray-800 font-semibold text-lg mb-2">Sin fichaje activo</h3>
                                </div>
                            ) : (
                                <>
                                    <div className='flex flex-col  bg-blue-100 p-4 rounded-xl w-1/2 mr-2'>
                                        <h3 className="text-lg w-full">Work Time</h3>
                                        <p className="text-gray-700 text-xl font-bold">{Math.floor(workingMinutes / 60)}h {workingMinutes % 60}m</p>
                                    </div>
                                    <div className='flex flex-col  bg-blue-100 p-4 rounded-xl w-1/2 ml-2'>
                                        <h3 className="text-lg w-full">Break Time</h3>
                                        <p className="text-gray-700 text-xl font-bold">{Math.floor(breakMinutes / 60)}h {breakMinutes % 60}m</p>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>

                <div className='p-4 m-5 sm:px-8 rounded-xl mt-10 mb-25 flex flex-col items-center bg-white shadow-lg pt-0'>
                    <div className='w-full flex justify-between items-center mb-4'>
                        <h2 className="text-xl font-bold bg-white p-4 text-left">Break History</h2>
                        <p className="text-blue-400 hover:underline cursor-pointer" onClick={() => navigate("history")}>See All</p>
                    </div>
                    {/* <div className='flex items-center justify-between mb-4 w-full bg-white p-4 rounded-xl'>
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
                    </div> */}
                    {lastBreaks && lastBreaks.length > 0 ? (
                        lastBreaks.map((breakItem, index) => (
                            <div key={index} className='flex items-center justify-between mb-4 w-full bg-white p-4 rounded-xl'>
                                <div>
                                    <h3 className="text-lg font-bold">
                                        {breakItem.start_time ? new Date(breakItem.start_time).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        }) : 'No Registrado'}
                                    </h3>
                                    <p className="text-gray-700">
                                        {breakItem.start_time && breakItem.end_time ? (
                                            new Date(breakItem.start_time).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }) + " - " + new Date(breakItem.end_time).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })
                                        ) : breakItem.start_time ? (
                                            new Date(breakItem.start_time).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }) + " - En curso"
                                        ) : (
                                            'No Registrado'
                                        )}
                                    </p>
                                </div>
                                <p className="text-gray-500">
                                    {breakItem.end_time ? (
                                        (() => {
                                            const start = new Date(breakItem.start_time);
                                            const end = new Date(breakItem.end_time);
                                            const diffMs = end - start;
                                            const diffHrs = Math.floor(diffMs / 3600000);
                                            const diffMins = Math.floor((diffMs % 3600000) / 60000);
                                            return `${diffHrs}h ${diffMins}m`;
                                        })()
                                    ) : (
                                        'En curso'
                                    )}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No break history available.</p>
                    )}
                </div>
            </div>
            <Toolbar />
        </section>
    );
}