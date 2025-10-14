import Header from "./Header";
import Toolbar from "./Toolbar";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import API_BASE_URL from "../config/api";
import timerUpIcon from "../assets/icons/timer-up-icon.svg";
import timerDownIcon from "../assets/icons/timer-down-icon.svg";
import LoadingOverlay from "./LoadingOverlay";
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

export default function Clock() {
    const clockInStatusChecked = useRef(false);
    const workMode = localStorage.getItem("work_mode_id");
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [qrResult, setQrResult] = useState("");
    const [clockStatus, setClockStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [streamReady, setStreamReady] = useState(null);
    const [serverTime, setServerTime] = useState(null);


    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];


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



    // Función que maneja la apertura de la cámara
    const handleOpenCamera = async () => {
        try {
            // Solicitar acceso a la cámara trasera del dispositivo si es posible
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });

            // Guardar el stream y mostrar la cámara
            setStreamReady(stream);
            setCameraOpen(true);
        } catch (err) {
            alert("No se pudo acceder a la cámara.");
        }
    };

    // Nuevo useEffect para asignar el stream cuando el video esté listo y la cámara esté abiertaq
    useEffect(() => {
        if (cameraOpen && streamReady && videoRef.current) {
            videoRef.current.srcObject = streamReady;
            videoRef.current.play().catch(err => {
                console.error("Error al reproducir el video:", err);
            });
        }
    }, [cameraOpen, streamReady]);

    // Función para verificar el estado de clock-in del usuario para saber si debe hacer clock-in o clock-out dependiendo de su estado actual
    const checkClockInStatus = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/clock/status/${companyId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch clock-in status");
            }
            const data = await response.json();
            // Si está clockeado, el siguiente paso es hacer clock-out, y viceversa
            setClockStatus(data.clockedIn ? 'out' : 'in');
            setIsLoading(false);
            clockInStatusChecked.current = true;
        } catch (error) {
            alert(error.message);
            navigate("/dashboard");
        }
    }

    // Funcion para hacer clock-in, enviando el código QR al backend
    const clockIn = async (qrCode) => {
        try {
            const response = await fetch(`${API_BASE_URL}/clock/in`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ code: qrCode, company_id: Number(companyId), work_mode_id: Number(workMode) })
            });
            if (!response.ok) {
                throw new Error("Código QR inválido o error en el servidor");
            }
            const data = await response.json();

            alert("Entrada registrada correctamente a las " + data.message);
            navigate("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    }

    // Funcion para hacer clock-out
    const clockOut = async (qrCode) => {
        try {
            const response = await fetch(`${API_BASE_URL}/clock/out`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ code: qrCode, company_id: Number(companyId) })
            });
            if (!response.ok) {
                throw new Error("Código QR inválido o error en el servidor");
            }
            const data = await response.json();
            alert("Salida registrada correctamente a las " + data.timestamp);
            navigate("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    }

    // Función para verificar el código QR y decidir si hacer clock-in o clock-out
    const verifyQrCode = async (qrCode) => {
        if (!clockInStatusChecked.current) {
            await checkClockInStatus();
        }
        if (clockStatus === 'in') {
            await clockIn(qrCode);
        } else if (clockStatus === 'out') {
            await clockOut(qrCode);
        }
    }

    // Verificar estado al cargar el componente
    useEffect(() => {
        if (workMode == "1") {
            checkClockInStatus();
        }
    }, []);

    // Escanea el QR cada 500ms cuando la cámara está abierta
    useEffect(() => {
        let interval;
        if (cameraOpen) {
            interval = setInterval(() => {
                if (
                    videoRef.current &&
                    canvasRef.current &&
                    videoRef.current.readyState === 4
                ) {
                    const video = videoRef.current;
                    const canvas = canvasRef.current;
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, canvas.width, canvas.height);
                    if (code) {
                        setQrResult(code.data);
                        clearInterval(interval);
                        // Detener la cámara después de leer el QR
                        if (video.srcObject) {
                            video.srcObject.getTracks().forEach(track => track.stop());
                        }
                        setCameraOpen(false);
                        // Ejecutar clock in/out automáticamente
                        verifyQrCode(code.data);
                    }
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [cameraOpen, clockStatus]);

    // Función para cerrar la cámara
    const handleCloseCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setCameraOpen(false);
        setStreamReady(null);
    };

    if (workMode == "1") { // ESCANEO PRESENCIAL 
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

        return (
            <section className="min-h-screen flex flex-col bg-background">
                <Header />
                <section className="pt-25">
                    <div>
                        <h2 className="text-3xl font-bold text-center py-4 ">
                            {serverTime ? serverTime.toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            }) : 'Cargando...'}
                        </h2>
                        <p className="text-center text-gray-600 mb-6">
                            {serverTime ? serverTime.toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : 'Cargando...'}
                        </p>
                    </div>
                    <div className="flex flex-col items-center px-4 sm:px-8">
                        {!cameraOpen ? (
                            <div
                                className={`w-full max-w-xs mx-auto ${clockStatus === 'in'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                                    : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                                    } text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-200 font-semibold cursor-pointer text-center`}
                                onClick={handleOpenCamera}
                            >
                                <p>Abrir Cámara</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
                                <div className="text-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Escaneando...
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Apunta la cámara hacia el código QR
                                    </p>
                                </div>
                                <div className="relative">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        className="w-full rounded-xl border-4 border-blue-200"
                                    />
                                    {/* Marco del QR */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-32 h-32 border-4 border-white border-dashed rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                                <canvas ref={canvasRef} style={{ display: "none" }} />

                                {/* Botón para cerrar cámara */}
                                <button
                                    className="w-full mt-4 bg-red-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 font-semibold"
                                    onClick={handleCloseCamera}
                                >
                                    Cerrar Cámara
                                </button>
                            </div>
                        )}



                        {qrResult && (
                            <div className={`mt-6 bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full border-l-4 ${clockStatus === 'in' ? 'border-green-500' : 'border-red-500'}`}>
                                <div className="flex items-center">
                                    <div className={`w-12 h-12 ${clockStatus === 'in' ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mr-4`}>
                                        <svg className={`w-6 h-6 ${clockStatus === 'in' ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">
                                            {clockStatus === 'in' ? '✅ Procesando entrada...' : '🔴 Procesando salida...'}
                                        </h4>
                                        <p className="text-sm text-gray-600 break-all">
                                            <strong>Código:</strong> {qrResult}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 pt-0 m-5 sm:px-8 mt-10 rounded-xl flex flex-col items-center bg-white shadow-lg">
                        <h2 className="text-xl font-bold bg-white p-4 border-b border-gray-300 text-left w-full max-w-2xl">
                            Resumen del Día
                        </h2>
                        <div className="flex justify-between bg-white p-4 w-full border-b border-gray-300">
                            <p className="text-gray-700">Entrada:</p>
                            <p className="font-semibold">XX:XXh</p>
                        </div>
                        <div className="flex justify-between bg-white p-4 w-full border-b border-gray-300">
                            <p className="text-gray-700">Salida:</p>
                            <p className="font-semibold">XX:XXh</p>
                        </div>
                        <div className="flex justify-between bg-white p-4 w-full border-b border-gray-300">
                            <p className="text-gray-700">Total Trabajado:</p>
                            <p className="font-semibold text-primary">XX:XXh</p>
                        </div>
                    </div>

                    <div className="p-4 pt-0 m-5 sm:px-8 mt-10 rounded-xl flex flex-col items-center bg-white shadow-lg">
                        <div className="w-full max-w-2xl">
                            <h2 className="text-xl font-bold bg-white p-4 border-b border-gray-300">
                                Historial de Fichajes
                            </h2>
                            <div className="flex justify-between bg-white p-4 w-full border-b border-gray-300 items-center">
                                <div>
                                    <p className="font-semibold">Ayer</p>
                                    <p className="text-gray-700">8:00 - 16:20</p>
                                </div>
                                <p className="text-gray-700">8h 20min:</p>
                            </div>
                            <div className="flex justify-between bg-white p-4 w-full border-b border-gray-300 items-center">
                                <div>
                                    <p className="font-semibold">Ayer</p>
                                    <p className="text-gray-700">8:00 - 16:20</p>
                                </div>
                                <p className="text-gray-700">8h 20min:</p>
                            </div>
                            <div className="flex justify-between bg-white p-4 w-full border-b border-gray-300 items-center">
                                <div>
                                    <p className="font-semibold">Ayer</p>
                                    <p className="text-gray-700">8:00 - 16:20</p>
                                </div>
                                <p className="text-gray-700">8h 20min:</p>
                            </div>

                        </div>
                    </div>

                    <div className="p-4 pt-0 m-5 sm:px-8 mt-10 rounded-xl flex flex-col items-center bg-white shadow-lg mb-20">
                        <div className="w-full max-w-2xl">
                            <h2 className="text-xl font-bold bg-white p-4 border-b border-gray-300">
                                Rendimiento Semanal
                            </h2>
                            <div className="w-full p-4" style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <Bar dataKey="uv" fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </section>
                <Toolbar />
            </section>
        )
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Modo de Trabajo No Disponible
                    </h2>
                    <p className="text-gray-600">
                        El escaneo QR solo está disponible para trabajo presencial.
                    </p>
                </div>
            </div>
        </>
    );
}