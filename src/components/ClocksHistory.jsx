import Header from "./Header";
import Toolbar from "./Toolbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api";


export default function ClocksHistory() {

    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");
    const [clocksHistory, setClocksHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const getClocksHistory = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/clock/history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ company_id: Number(companyId) })
            });

            if (!response.ok) {
                throw new Error('Error fetching clocks history');
            }

            const data = await response.json();
            setClocksHistory(data["data"]);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const calculateTotalHours = (clockIn, clockOut) => {
        // Si no hay entrada o salida, retornar 0:00
        if (!clockIn || !clockOut) {
            return '0:00';
        }

        try {
            // Crear objetos Date desde las cadenas de tiempo
            const startTime = new Date(clockIn);
            const endTime = new Date(clockOut);

            // Validar que las fechas sean válidas
            if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                return '0:00';
            }

            // Calcular la diferencia en milisegundos
            const timeDifferenceMs = endTime.getTime() - startTime.getTime();

            // Si la diferencia es negativa (salida antes que entrada), retornar 0:00
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
        getClocksHistory();
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

    return (
        <section className="min-h-screen bg-background">
            <Header />
            <div className="pt-25">
                <h2 className="text-xl font-bold p-4">Historial Fichajes</h2>
                {
                    clocksHistory.length === 0 ? (
                        <p className="text-gray-600">No hay registros de fichajes.</p>
                    ) : (
                        <div >
                            {clocksHistory.map((clock) => (
                                <div key={clock.id} className="flex justify-between bg-white p-4 items-center bg-white rounded-2xl shadow-md m-4">
                                    <div>
                                        <p className="font-semibold">{new Date(clock.created_at).toLocaleDateString('es-ES')}</p>
                                        <p className="text-gray-700">{new Date(clock.check_in).toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })} - {new Date(clock.check_out).toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}</p>
                                    </div>
                                    <p className="text-gray-700">{calculateTotalHours(clock.check_in, clock.check_out)} h</p>
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