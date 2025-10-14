import Header from './Header';
import Toolbar from './Toolbar'
import { useState, useEffect, useRef } from 'react';
import 'cally';
import API_BASE_URL from '../config/api.js';

export default function Vacations() {
    const [absences, setAbsences] = useState([]);
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId || payload.id || payload.sub;
    const [dateRange, setDateRange] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const calendarRef = useRef(null);

    function handleRangeChange(event) {
        setDateRange(event.target.value);
    }

    const getAbsences = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/leave-types`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch absences");
            }
            const data = await response.json();
            setAbsences(data["data"]);
        } catch (error) {
            console.error("Error fetching absences:", error);
        }
    }

    useEffect(() => {
        getAbsences();
        if (dateRange) {
            const [start, end] = dateRange.split("/");
            setStartDate(start);
            setEndDate(end);
        }
    }, [dateRange]);

    useEffect(() => {
        const customizeButtons = () => {
            // console.log('Personalizando botones...');

            const calendarElement = document.querySelector('calendar-range');

            if (calendarElement && calendarElement.shadowRoot) {
                const shadowButtons = calendarElement.shadowRoot.querySelectorAll('button');
                // console.log('Encontrados botones:', shadowButtons.length);

                shadowButtons.forEach((button, index) => {
                    const part = button.getAttribute('part');
                    // console.log(`Procesando botón ${index} con part: ${part}`);

                    if (part && part.includes('previous')) {
                        // console.log('Personalizando botón Previous');
                        // Cambiar solo el contenido del slot
                        const slot = button.querySelector('slot[name="previous"]');
                        if (slot) {
                            slot.textContent = '<';
                        }

                        // Aplicar estilos
                        button.style.cssText = `
                            font-size: 20px !important;
                            font-weight: bold !important;
                            width: 40px !important;
                            height: 40px !important;
                            border-radius: 50% !important;
                            background: #f3f4f6 !important;
                            border: 1px solid #d1d5db !important;
                            color: #374151 !important;
                            cursor: pointer !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            transition: all 0.2s ease !important;
                        `;
                    }

                    if (part && part.includes('next')) {
                        // console.log('Personalizando botón Next');
                        // Cambiar solo el contenido del slot
                        const slot = button.querySelector('slot[name="next"]');
                        if (slot) {
                            slot.textContent = '>';
                        }

                        // Aplicar estilos
                        button.style.cssText = `
                            font-size: 20px !important;
                            font-weight: bold !important;
                            width: 40px !important;
                            height: 40px !important;
                            border-radius: 50% !important;
                            background: #f3f4f6 !important;
                            border: 1px solid #d1d5db !important;
                            color: #374151 !important;
                            cursor: pointer !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            transition: all 0.2s ease !important;
                        `;
                    }
                });

                // console.log('Personalización completada');
            } else {
                console.log('No se encontró calendar-range o shadowRoot');
            }
        };

        // Ejecutar después de que se renderice el calendario
        const timeouts = [100, 500, 1000, 2000].map(delay =>
            setTimeout(customizeButtons, delay)
        );

        // Observer para detectar cambios (cuando cambia de mes)
        const observer = new MutationObserver(() => {
            setTimeout(customizeButtons, 100);
        });

        // Observar cambios en el calendario
        const calendarElement = document.querySelector('calendar-range');
        if (calendarElement && calendarElement.shadowRoot) {
            observer.observe(calendarElement.shadowRoot, {
                childList: true,
                subtree: true
            });
        }

        return () => {
            timeouts.forEach(clearTimeout);
            observer.disconnect();
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/vacations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: userId,
                    leave_type_id: e.target.absenceType.value,
                    start_date: startDate,
                    end_date: endDate,
                })
            });

            if (response.ok) {
                alert("Vacation created successfully");
                e.target.reset();
                setDateRange("");
            } else {
                throw new Error("Failed to create vacation");
            }
        } catch (error) {
            console.error("Error creating vacation:", error);
            alert("Error creating vacation");
        }
    }

    return (
        <section>
            <Header />
            <div className="pt-25 bg-background min-h-screen">
                <div className="p-6">
                    <h2 className='text-2xl font-bold mb-4'>Request Vacation</h2>
                    <div className='flex justify-center bg-white p-6 rounded-lg shadow-md w-full mx-auto rounded-xl'>
                        <calendar-range
                            ref={calendarRef}
                            months={2}
                            value={dateRange}
                            onchange={handleRangeChange}
                        >
                            <calendar-month />
                        </calendar-range>

                    </div>
                </div>

                <p className="mt-4 text-center text-gray-600">
                    Rango seleccionado: <span className="font-semibold">{dateRange || "Ninguno"}</span>
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col items-center mt-6 w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                    <label htmlFor="absenceType" className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de ausencia:
                    </label>
                    <select
                        id="absenceType"
                        name="absenceType"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                        required
                    >
                        <option value="">Selecciona un tipo</option>
                        {absences.map((absence) => (
                            <option key={absence.id} value={absence.id}>{absence.name}</option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!dateRange}
                    >
                        Solicitar Vacaciones
                    </button>
                </form>

                <div className='w-full mt-10 max-w-2xl p-4 pt-0 sm:px-8 rounded-xl flex flex-col mb-20'>
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