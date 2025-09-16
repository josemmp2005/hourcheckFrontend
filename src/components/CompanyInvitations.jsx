import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CompanyInvitations() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [workMode, setWorkMode] = useState("");
    const token = localStorage.getItem("token");
    // Decode JWT to get userId (invited_by)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId || payload.id || payload.sub;
    // console.log("User ID from token:", userId);

    const handleInvite = async (e) => {
        e.preventDefault();
        try {

            const companyId = localStorage.getItem("company_id");
            const response = await fetch("http://localhost:3000/company-invitations/generate-invitation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ company_id: companyId, invited_by: userId, role_id: role, work_mode_id: workMode, email: email })
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Invite sent:", data);
            } else {
                console.error("Error sending invite:", response.statusText);
            }
        } catch (error) {
            console.error("Error sending invite:", error);
        }
    }

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
                    <select name="role" id="role" className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none mt-4">
                        <option value="" selected disabled>Selecciona un rol</option>
                        <option value="3">Manager</option>
                        <option value="4" >Employee</option>
                    </select>
                    <select name="work-mode" id="work-mode" className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none mt-4">
                        <option value="" selected disabled>Selecciona un modo de trabajo</option>
                        <option value="1">On-site</option>
                        <option value="2" >Remote</option>
                        <option value="3" >Mixed</option>
                    </select>
                    <button className="btn bg-blue-500 text-white p-2 rounded-md mt-4">Invitar</button>
                </div>
            </form>
        </>
    );
}