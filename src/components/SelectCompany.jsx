import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header.jsx";
import logo from "../assets/logo.svg";

export default function SelectCompany() {
    localStorage.removeItem("company_id");

    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    const getCompanmies = async () => {
        try {
            const response = await fetch("http://localhost:3000/users/companies", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch companies");
            }
            const data = await response.json();
            setCompanies(data);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        getCompanmies();
    }, []);

    if (companies.length === 0) {
        return (
            <>
                <Header />
                <div className="card bg-white w-8/10 h-8/10 border-2 border-gray-300 rounded-2xl mt-10 pb-10 max-w-[350px] max-h-fit justify-self-center mx-auto" >
                    <img src={logo} alt="Logo" />
                    <div className="flex flex-col items-center gap-4 mt-6">
                        <a
                            href="/create-new-company"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors text-center"
                        >
                            Crear nueva empresa
                        </a>
                        <a
                            href="/join-existing-company"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors text-center"
                        >
                            Unirse a una empresa existente
                        </a>
                    </div>
                </div>
            </>
        );
    }

    console.log(companies);
    return (
        <>
            <Header />
            <div className="text-center font-bold text-2xl mt-8 mb-6">Selecciona una empresa</div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center px-4">
                {companies.map((item) => (
                    <div
                        className="company-card bg-white border border-gray-300 shadow-lg p-6 rounded-xl max-w-xs w-full cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200 flex flex-col items-center"
                        key={item.company.id}
                        onClick={() => {
                            localStorage.setItem("company_id", item.company.id);
                            navigate(`/dashboard`);
                        }}
                    >
                        <img
                            src={item.company.photo_url !== "none" ? item.company.photo_url : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt={item.company.name}
                            className="w-20 h-20 rounded-full border-2 mb-4 object-cover"
                        />
                        <h2 className="text-lg font-bold mb-2 text-gray-800">{item.company.name}</h2>
                        <p className="text-gray-600 mb-1">{item.company.address}</p>
                        <p className="text-gray-600 mb-1">{item.company.email}</p>
                        <p className="text-gray-600 mb-1">{item.company.phone}</p>
                    </div>
                ))}
            </div>
        </>
    );
}