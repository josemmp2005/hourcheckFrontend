import Header from './Header';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function EmployeesManagement() {
    const companyId = localStorage.getItem("company_id");
    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState({});
    const [workModes, setWorkModes] = useState({});
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId || payload.id || payload.sub;
    const navigate = useNavigate();

    // Cargar empleados
    const getEmployees = async () => {
        try {
            const response = await fetch("http://localhost:3000/companies/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ company_id: Number(companyId) })
            });
            if (!response.ok) throw new Error("Error fetching employees");
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    // Cargar todos los roles de una vez
    const getRoles = async () => {
        try {
            const response = await fetch("http://localhost:3000/roles", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) throw new Error("Error fetching roles");
            const data = await response.json();
            // Convierte el array en un diccionario { id: name }
            const rolesDict = {};
            data.forEach(role => {
                rolesDict[role.id] = role.name;
            });
            setRoles(rolesDict);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    // Cargar todos los work modes de una vez
    const getWorkModes = async () => {
        try {
            const response = await fetch("http://localhost:3000/work-modes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) throw new Error("Error fetching work modes");
            const data = await response.json();
            const workModesDict = {};
            data.forEach(mode => {
                workModesDict[mode.id] = mode.name;
            });
            setWorkModes(workModesDict);
        } catch (error) {
            console.error("Error fetching work modes:", error);
        }
    };

    useEffect(() => {
        getEmployees();
        getRoles();
        getWorkModes();
    }, []);

    return (
        <>
            <Header />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Empleados</h2>
                <ul className="space-y-2">
                    {employees.length === 0 ? (
                        <li className="text-gray-500">No hay empleados.</li>
                    ) : (
                        employees
                            .filter(emp => emp.user.id !== userId)
                            .map(emp => (
                                <div key={emp.user.id} className="company-card bg-white border border-gray-300 shadow-lg p-6 rounded-xl max-w-xs w-full cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200 flex flex-col items-center"
                                    onClick={() => {
                                        navigate(`/admin-panel/employee-management?id=${emp.user.id}`);
                                    }}
                                >
                                    <img src={emp.user.image ? emp.user.image : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={emp.user.name} className="w-24 h-24 rounded-full mb-4" />
                                    <p><strong>Nombre:</strong> {emp.user.name}</p>
                                    <p><strong>Email:</strong> {emp.user.email}</p>
                                    <p><strong>Rol:</strong> {roles[emp.role_id] || "Cargando..."}</p>
                                    <p><strong>Modalidad:</strong> {workModes[emp.work_mode_id] || "Cargando..."}</p>
                                </div>
                            ))
                    )}
                </ul>
            </div>
        </>
    );
}