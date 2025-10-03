import { Link } from "react-router-dom";
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import API_BASE_URL from "../config/api.js";


export default function SideBar() {
    const [visible, setVisible] = useState(false);
    const sidebarRef = useRef(null);
    const role = localStorage.getItem("role_id");
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");
    const [companyData, setCompanyData] = useState(null);

    const getCompanyData = async () => {
        try {
            const companyData = await fetch(`${API_BASE_URL}/companies/info`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: Number(companyId) })
            });
            if (!companyData.ok) {
                throw new Error("Failed to fetch company data");
            }
            const data = await companyData.json();
            setCompanyData(data);
        } catch (error) {
            console.error("Error fetching company data:", error);
        }
    }

    useEffect(() => {
        getCompanyData();
    }, []);



    const adminOptions = {
        "Clock In": "/clock-in",
        "Break": "/break",
        "Absences": "/absences",
        "Vacations": "/vacations",
        "Info": "/info",
        "Admin Panel": "/admin-panel",
        "Select Company": "/select-company",
        "Dashboard": "/dashboard",
        "Profile": "/profile"
    };

    const managerOptions = {
        "Clock In": "/clock-in",
        "Break": "/break",
        "Absences": "/absences",
        "Vacations": "/vacations",
        "Info": "/info",
        "Manager Panel": "/manager",
        "Select Company": "/select-company",
        "Dashboard": "/dashboard",
        "Profile": "/profile"
    };

    const userOptions = {
        "Clock In": "/clock-in",
        "Break": "/break",
        "Absences": "/absences",
        "Vacations": "/vacations",
        "Info": "/info",
        "Select Company": "/select-company",
        "Dashboard": "/dashboard",
        "Profile": "/profile"
    };

    const noRoleOptions = {
        "Select Company": "/select-company",
        "Info": "/info",
        "Profile": "/profile"
    }

    let sidebarOptions = {};
    if (role === "2") {
        sidebarOptions = adminOptions;
    }
    else if (role === "3") {
        sidebarOptions = managerOptions;
    } else if (role === "4") {
        sidebarOptions = userOptions;
    } else {
        sidebarOptions = noRoleOptions;
    }

    // Cierra el sidebar al hacer clic fuera (solo en móvil)
    const handleClickOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setVisible(false);
        }
    };

    React.useEffect(() => {
        if (visible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [visible]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <>
            {/* Botón hamburguesa - Solo visible en móvil y cuando el sidebar está cerrado */}
            <button
                className={`burger top-4 left-4 z-50 text-primary text-white px-4 py-2 rounded hover:bg-gray-700 transition lg:hidden ${visible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onClick={() => setVisible(true)}
            >
                <p className="text-3xl font-bold text-primary">☰</p>
            </button>

            {/* Sidebar fijo para desktop */}
            <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white shadow-lg z-40 flex-col p-4">
                <div className="sidebar-header mb-8 mt-4">
                    <Link to="/" className="text-2xl font-bold tracking-wide hover:text-blue-400 transition">
                        {companyData ? companyData.name : "HourCheck"}
                    </Link> 
                </div>

                <nav className="flex flex-col gap-4 flex-1">
                    {Object.entries(sidebarOptions).map(([name, path]) => (
                        <Link
                            key={name}
                            to={path}
                            className="hover:bg-gray-700 p-3 rounded transition text-gray-200 hover:text-white"
                        >
                            {name}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto">
                    <button
                        className="w-full bg-red-500 hover:bg-red-600 p-3 rounded transition font-medium"
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Sidebar móvil con overlay */}
            <aside
                ref={sidebarRef}
                className={`lg:hidden fixed rounded-r-xl top-0 left-0 h-screen w-64 bg-white text-primary shadow-lg z-40 flex flex-col p-4 transform transition-transform duration-300 ${visible ? "translate-x-0" : "-translate-x-full"}`}
                style={{ pointerEvents: visible ? "auto" : "none" }}
            >
                <button
                    className="absolute top-4 right-4 text-white text-xl bg-primary rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 transition"
                    onClick={() => setVisible(false)}
                >
                    ×
                </button>

                <div className="sidebar-header mb-8 mt-8">
                    <Link to="/" className="text-2xl font-bold tracking-wide hover:text-blue-400 transition">
                        {companyData ? companyData.name : "HourCheck"}
                    </Link>
                </div>

                <nav className="flex flex-col gap-4 flex-1">
                    {Object.entries(sidebarOptions).map(([name, path]) => (
                        <Link
                            key={name}
                            to={path}
                            className="hover:bg-secondary p-3 rounded transition text-primary hover:text-white"
                            onClick={() => setVisible(false)} // Cierra el sidebar al hacer click
                        >
                            {name}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto">
                    <button
                        className="w-full bg-red-500 hover:bg-red-600 p-3 rounded transition font-medium"
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Overlay para móvil */}
            {visible && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setVisible(false)}
                ></div>
            )}
        </>
    );
}