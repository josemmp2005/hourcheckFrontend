import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api.js";

export default function CompanyInvitations() {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [workMode, setWorkMode] = useState("");
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId || payload.id || payload.sub;
    const [roles, setRoles] = useState([]);
    const [workModes, setWorkModes] = useState([]);
    const [shifts, setShifts] = useState([]);


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

    const handleInvite = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const companyId = localStorage.getItem("company_id");
            const response = await fetch(`${API_BASE_URL}/company-invitations/generate-invitation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    company_id: companyId,
                    invited_by: userId,
                    role_id: role,
                    work_mode_id: workMode,
                    shift_id: e.target.shift.value, 
                    email: email
                })
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Invite sent:", data);
                // Opcional: muestra mensaje de éxito o limpia el formulario
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Error enviando invitación");
            }
        } catch (error) {
            setError(error.message || "Error enviando invitación");
            console.error("Error sending invite:", error);
        }
    }

    useEffect(() => {
        getRoles();
        getWorkModes();
        getShifts();
    }, []);

    return (
        <>
            <Header />
            <h1 className="text-2xl font-bold text-center">Company Invitations</h1>
            <form action="" onSubmit={handleInvite} className="flex flex-col items-center mt-10">
                <div className="input-container flex flex-col mt-20 mb-10 rounded-md w-full pl-10 pr-10">
                    <input
                        className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                        type="email"
                        id="email"
                        placeholder="Correo"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
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
                    <select name="shift" id="shift" className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none mt-4">
                        <option value="" selected disabled>Selecciona un turno</option>
                        {shifts.map((shift) => (
                            <option key={shift.id} value={shift.id}>{shift.name}</option>
                        ))}
                    </select>
                    <button className="btn bg-blue-500 text-white p-2 rounded-md mt-4">Invitar</button>
                </div>
            </form>
        </>
    );
}