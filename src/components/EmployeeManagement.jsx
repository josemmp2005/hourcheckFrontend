import Header from './Header';
import { useEffect, useState } from 'react';

export default function EmployeeManagement() {
    const url = new URL(window.location.href);
    const employeeId = url.searchParams.get("id");
    const companyId = localStorage.getItem("company_id");
    const token = localStorage.getItem("token");
    const [error, setError] = useState("");
    const [employeeData, setEmployeeData] = useState(null);
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId || payload.id || payload.sub;

    const getEmployeeData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/companies/employee/${employeeId}`, {
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


    useEffect(() => {
        getEmployeeData();

    }, []);

    // Placeholder para la función de actualización
    const updateEmployee = (e) => {
        e.preventDefault();
        // Lógica para actualizar empleado aquí
    };

    const employee = Array.isArray(employeeData) ? employeeData[0] : employeeData;
    console.log(employee);

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


                    {error && <p className="error text-red-500">{error}</p>}
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Actualizar Empleado</button>
                </form>
            </div>
        </div>
    );
}