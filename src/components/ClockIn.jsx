import Header from "./Header";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import API_BASE_URL from "../config/api";

export default function ClockIn() {
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

    if (workMode == "1") { // ESCANEO PRESENCIAL 
        if (isLoading) {
            return (
                <>
                    <Header />
                    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 flex items-center justify-center">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Verificando estado...</p>
                        </div>
                    </div>
                </>
            );
        }

        return (
            <>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">
                                {clockStatus === 'in' ? '🕐 Clock In' : '🕕 Clock Out'}
                            </h2>
                            <p className="text-lg text-gray-600 mb-2">
                                {clockStatus === 'in' 
                                    ? 'Escanea tu código QR para registrar tu entrada'
                                    : 'Escanea tu código QR para registrar tu salida'
                                }
                            </p>
                            <p className="text-sm text-gray-500">
                                Alinea el código QR dentro del marco de la cámara
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            {!cameraOpen ? (
                                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                                    <div className="mb-6">
                                        <div className={`w-24 h-24 ${clockStatus === 'in' ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                            <svg className={`w-12 h-12 ${clockStatus === 'in' ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            {clockStatus === 'in' ? 'Registrar Entrada' : 'Registrar Salida'}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Presiona el botón para iniciar el escaneo
                                        </p>
                                    </div>
                                    <button
                                        className={`w-full ${clockStatus === 'in' 
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                                            : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                                        } text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 font-semibold`}
                                        onClick={handleOpenCamera}
                                    >
                                        📷 Abrir Cámara
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
                                    <div className="text-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            🔍 Escaneando...
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
                    </div>
                </div>
            </>
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