import Header from './Header';
import Toolbar from './Toolbar';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api.js';

export default function Break(){

    const breakStatusChecked = useRef(false);
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('company_id');
    const navigate = useNavigate();
    const [breakStatus, setBreakStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [canTakeBreak, setCanTakeBreak] = useState(false);

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
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-indigo-100 flex items-center justify-center">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            No puedes tomar un descanso
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Debes hacer clock-in primero para poder tomar un descanso.
                        </p>
                        <button 
                            onClick={() => navigate("/clock-in")}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                        >
                            Ir a Clock-In
                        </button>
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