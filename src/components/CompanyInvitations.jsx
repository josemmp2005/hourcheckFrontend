import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CompanyInvitations() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    return (
        <>
            <Header />
            <h1>Company Invitations</h1>
            <form action="">
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
                        <option value="" >Selecciona un rol</option>
                        <option value="3">Manager</option>
                        <option value="4" selected>Employee</option>
                    </select>
                    <button className="btn bg-blue-500 text-white p-2 rounded-md mt-4">Invitar</button>
                </div>
            </form>
        </>
    );
}