import Header from "./Header.jsx";
import { useState, useEffect } from "react";
import API_BASE_URL from "../config/api.js";

export default function ShiftsManagements() {
    const [shifts, setShifts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", start: "", end: "" });
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");

    const getShifts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/shifts/${companyId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch shifts");
            }
            const data = await response.json();
            setShifts(data);
        } catch (error) {
            console.error("Error fetching shifts:", error);
        }
    };

    useEffect(() => {
        getShifts();
    }, []);
    // shifts = shifts["data"] || [];
    // console.log(shifts["data"]);
    


    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch(`${API_BASE_URL}/shifts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    start_time: formData.start,
                    end_time: formData.end,
                    break_minutes: formData.break,
                    company_id: companyId
                })
            });
            if (!response.ok) throw new Error("Error creando turno");
            setShowForm(false);
            setFormData({ name: "", start: "", end: "", break: "" });
            getShifts();
        } catch (err) {
            setError(err.message || "Error creando turno");
        }
    };


    if (shifts.length === 0 && !showForm) {
        return (
            <>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="bg-white border-2 border-gray-300 rounded-2xl shadow-lg p-8 max-w-xs w-full flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-4">No hay turnos</h2>
                        <p className="text-gray-600 mb-6 text-center">
                            No hay turnos disponibles en este momento.
                        </p>
                        <button
                            className="bg-[#234e63] text-white px-6 py-2 rounded-xl shadow hover:bg-[#1d9796] transition-colors font-semibold"
                            onClick={() => setShowForm(true)}
                        >
                            Crear nuevo turno
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (showForm) {
        return (
            <>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="bg-white border-2 border-gray-300 rounded-2xl shadow-lg p-8 max-w-xs w-full flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-4">Crear nuevo turno</h2>
                        <form className="flex flex-col gap-4 w-full" onSubmit={handleFormSubmit}>
                            <input
                                className="border border-gray-300 rounded-lg px-4 py-2"
                                type="text"
                                name="name"
                                placeholder="Nombre del turno"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                            />
                            <input
                                className="border border-gray-300 rounded-lg px-4 py-2"
                                type="time"
                                name="start"
                                placeholder="Hora de inicio"
                                value={formData.start}
                                onChange={handleFormChange}
                                required
                            />
                            <input
                                className="border border-gray-300 rounded-lg px-4 py-2"
                                type="time"
                                name="end"
                                placeholder="Hora de fin"
                                value={formData.end}
                                onChange={handleFormChange}
                                required
                            />
                            <input
                                className="border border-gray-300 rounded-lg px-4 py-2"
                                type="number"
                                name="break"
                                placeholder="descanso"
                                value={formData.break}
                                onChange={handleFormChange}
                                required
                            />

                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-[#234e63] text-white px-6 py-2 rounded-xl shadow hover:bg-[#1d9796] transition-colors font-semibold"
                                >
                                    Guardar turno
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl shadow hover:bg-gray-300 transition-colors font-semibold"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        );
    }
    return (
        <>
            <Header />
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
                <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full">
                    <h1 className="text-3xl font-bold text-blue-700 mb-8">Gestión de Turnos</h1>
                    <button
                        className="bg-[#234e63] text-white px-6 py-2 rounded-xl shadow hover:bg-[#1d9796] transition-colors font-semibold mb-6"
                        onClick={() => setShowForm(true)}
                    >
                        Crear nuevo turno
                    </button>
                    <div className="w-full">
                        {shifts["data"].map((shift) => (
                            <div key={shift.id} className="border-b border-gray-300 py-4">
                                <h2 className="text-xl font-semibold">{shift.name}</h2>
                                <p className="text-gray-600">
                                    {shift.start_time} - {shift.end_time} (Descanso: {shift.break_minutes} min)
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}