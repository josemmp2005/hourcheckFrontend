import Header from "./Header";
import Toolbar from "./Toolbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api";

export default function BreaksHistory() {

    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");
    const [breaksHistory, setBreaksHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const getBreaksHistory = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/breaks/history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ company_id: Number(companyId) })
            });

            if (!response.ok) {
                throw new Error('Error fetching breaks history');
            }

            const data = await response.json();
            setBreaksHistory(data["data"] || []);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const calculateTotalHours = (startTime, endTime) => {
        // Si no hay hora de inicio o fin, retornar 0:00
        if (!startTime || !endTime) {
            return '0:00';
        }

        try {
            // Crear objetos Date desde las cadenas de tiempo
            const start = new Date(startTime);
            const end = new Date(endTime);

            // Validar que las fechas sean válidas
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return '0:00';
            }

            // Calcular la diferencia en milisegundos
            const timeDifferenceMs = end.getTime() - start.getTime();

            // Si la diferencia es negativa, retornar 0:00
            if (timeDifferenceMs < 0) {
                return '0:00';
            }

            // Convertir milisegundos a horas y minutos
            const totalMinutes = Math.floor(timeDifferenceMs / (1000 * 60));
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            // Formatear como HH:MM
            return `${hours}:${minutes.toString().padStart(2, '0')}`;
        } catch (error) {
            console.error('Error calculating total hours:', error);
            return '0:00';
        }
    };

    useEffect(() => {
        getBreaksHistory();
    }, []);

    if (isLoading) {
        return (
            <section className="min-h-screen flex items-center justify-center">
                <Header />
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-6 border-secondary"></div>
                    <p className="text-gray-600">Cargando historial...</p>
                </div>
                <Toolbar />
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-background">
            <Header />
            <div className="pt-25">
                <h2 className="text-xl font-bold p-4">Historial de Descansos</h2>
                {
                    breaksHistory.length === 0 ? (
                        <p className="text-gray-600 p-4">No hay registros de descansos.</p>
                    ) : (
                        <div>
                            {breaksHistory.map((breakItem) => (
                                <div key={breakItem.id} className="flex justify-between bg-white p-4 items-center rounded-2xl shadow-md m-4">
                                    <div>
                                        <p className="font-semibold">
                                            {breakItem.start_time ? new Date(breakItem.start_time).toLocaleDateString('es-ES') : 'No Registrado'}
                                        </p>
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
                                    <p className="text-gray-700">
                                        {breakItem.end_time ? calculateTotalHours(breakItem.start_time, breakItem.end_time) + ' h' : 'En curso'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
            <Toolbar />
        </section>
    );
}