import Header from './Header';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../config/api.js';

export default function EmployeeManagement() {
    const url = new URL(window.location.href);
    const employeeId = url.searchParams.get("id");
    const companyId = localStorage.getItem("company_id");
    const role = localStorage.getItem("role_id");
    const workMode = localStorage.getItem("work_mode_id");
    const token = localStorage.getItem("token");
    const [error, setError] = useState("");
    const [employeeData, setEmployeeData] = useState(null);
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId || payload.id || payload.sub;
    const [roles, setRoles] = useState([]);
    const [workModes, setWorkModes] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [employeeShifts, setEmployeeShifts] = useState([]);



    const getEmployeeData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/employee/${employeeId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ company_id: Number(companyId) })
            });
            if (!response.ok) {
                throw new Error("Error fetching employee data");
            }
            const data = await response.json();
            setEmployeeData(data);
        } catch (error) {
            setError(error.message || "Error fetching employee data");
            console.error("Error fetching employee data:", error);
        }
    };


    const getRoles = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/roles`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch roles");
            }
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }

    const getWorkModes = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/work-modes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch work modes");
            }
            const data = await response.json();
            setWorkModes(data);
        } catch (error) {
            console.error("Error fetching work modes:", error);
        }
    }

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
            setShifts(data.data);
        } catch (error) {
            console.error("Error fetching shifts:", error);
        }
    };

    const getEmployeesShifts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/shifts/${companyId}/employees`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("Error fetching shifts");
            const data = await response.json();
            setEmployeeShifts(data["data"] || []);
        } catch (error) {
            console.error("Error fetching shifts:", error);
        }
    };


    useEffect(() => {
        getEmployeeData();
        getRoles();
        getWorkModes();
        getShifts();
        getEmployeesShifts();
    }, []);

    // Placeholder para la función de actualización
    const updateEmployee = (e) => {
        e.preventDefault();
        // Lógica para actualizar empleado aquí
    };

    const employee = Array.isArray(employeeData) ? employeeData[0] : employeeData;
    // console.log(employee);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Gestión de Empleado</h2>
                <form className="form flex flex-col items-center w-full" onSubmit={updateEmployee}>
                    <img
                        src={
                            employee && employee.user && employee.user.photo_url
                                ? employee.user.photo_url
                                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt={employee && employee.user ? employee.user.name : "Empleado"}
                        className="w-24 h-24 rounded-full mb-4"
                    />

                    <p className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none">
                        {employee && employee.user ? employee.user.name : "Cargando..."}
                    </p>
                    <p className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none">
                        {employee && employee.user ? employee.user.email : "Cargando..."}
                    </p>
                    <select
                        name="role"
                        id="role"
                        className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none mt-4"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                    >
                        <option value="" disabled>Selecciona un rol</option>
                        {roles
                            .filter(role => role.name !== "admin" && role.name !== "superadmin")
                            .map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                    </select>
                    <select
                        name="work-mode"
                        id="work-mode"
                        className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none mt-4"
                        value={workMode}
                        onChange={e => setWorkMode(e.target.value)}
                    >
                        <option value="" disabled>Selecciona un modo de trabajo</option>
                        {workModes.map((mode) => (
                            <option key={mode.id} value={mode.id}>{mode.name}</option>
                        ))}
                    </select>   
                    <select
                        name="shift"
                        id="shift"
                        className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none mt-4"
                    >
                        <option value="" disabled>Selecciona un turno</option>
                        {shifts.map((shift) => (
                            <option key={shift.id} value={shift.id}>
                                {shift.name}
                            </option>
                        ))}
                    </select>

                    {error && <p className="error text-red-500">{error}</p>}
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Actualizar Empleado</button>
                </form>
            </div>
        </div>
    );
}