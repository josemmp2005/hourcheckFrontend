import { Link } from "react-router-dom";
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api.js";
import logo from "../assets/logo.png";
import homeIcon from '../assets/home-icon.svg';
import timerIcon from '../assets/timer-icon.svg';
import companiesIcon from '../assets/companies-icon.svg';
import breakIcon from '../assets/break-icon.svg';


export default function SideBar() {
    const [visible, setVisible] = useState(false);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const role = localStorage.getItem("role_id");
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");
    const [companyData, setCompanyData] = useState(null);
    const [userData, setUserData] = useState(null);


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

    const getUserData = async () => {
        try {
            const userData = await fetch(`${API_BASE_URL}/users/info`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!userData.ok) {
                throw new Error("Failed to fetch user data");
            }
            const data = await userData.json();
            // console.log(data);
            setUserData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    useEffect(() => {
        getCompanyData();
        getUserData();
    }, []);

    // console.log(userData)


    const adminOptions = [
        { id: 1, name: "Clock", path: "/clock", icon: timerIcon },
        { id: 2, name: "Break", path: "/break", icon: breakIcon },
        { id: 3, name: "Absences", path: "/absences", icon: companiesIcon },
        { id: 4, name: "Vacations", path: "/vacations", icon: companiesIcon },
        { id: 5, name: "Info", path: "/info", icon: companiesIcon },
        { id: 6, name: "Admin Panel", path: "/admin-panel", icon: companiesIcon },
        { id: 7, name: "Select Company", path: "/select-company", icon: companiesIcon },
        { id: 8, name: "Dashboard", path: "/dashboard", icon: companiesIcon },
        { id: 9, name: "Profile", path: "/profile", icon: companiesIcon }
    ];

    const managerOptions = [
        { id: 1, name: "Clock", path: "/clock", icon: timerIcon },
        { id: 2, name: "Break", path: "/break", icon: breakIcon },
        { id: 3, name: "Absences", path: "/absences", icon: companiesIcon },
        { id: 4, name: "Vacations", path: "/vacations", icon: companiesIcon },
        { id: 5, name: "Info", path: "/info", icon: companiesIcon },
        { id: 6, name: "Manager Panel", path: "/manager", icon: companiesIcon },
        { id: 7, name: "Select Company", path: "/select-company", icon: companiesIcon },
        { id: 8, name: "Dashboard", path: "/dashboard", icon: companiesIcon },
        { id: 9, name: "Profile", path: "/profile", icon: companiesIcon }
    ];

    const userOptions = [
        { id: 1, name: "Clock", path: "/clock", icon: timerIcon },
        { id: 2, name: "Break", path: "/break", icon: breakIcon },
        { id: 3, name: "Absences", path: "/absences", icon: breakIcon },
        { id: 4, name: "Vacations", path: "/vacations", icon: companiesIcon },
        { id: 5, name: "Info", path: "/info", icon: companiesIcon },
        { id: 6, name: "Select Company", path: "/select-company", icon: companiesIcon },
        { id: 7, name: "Dashboard", path: "/dashboard", icon: companiesIcon },
        { id: 8, name: "Profile", path: "/profile", icon: companiesIcon }
    ];

    const noRoleOptions = [
        { id: 1, name: "Select Company", path: "/select-company", icon: companiesIcon },
        { id: 2, name: "Info", path: "/info", icon: companiesIcon },
        { id: 3, name: "Profile", path: "/profile", icon: companiesIcon }
    ];

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
                    <Link to="/dashboard" className="text-2xl font-bold tracking-wide hover:text-blue-400 transition">
                        {companyData ? companyData.name : "HourCheck"}
                    </Link>
                </div>

                {/* Sidebar desktop */}
                <nav className="flex flex-col gap-4 flex-1">
                    {sidebarOptions.map((option) => (
                        <div
                            key={option.id}
                            className="hover:bg-secondary p-3 rounded transition hover:text-white flex items-center gap-4 cursor-pointer"
                            onClick={() => setVisible(false) || navigate(option.path)}
                        >
                            <img src={option.icon} alt={`${option.name} icon`} className="w-5 h-5 filter brightness-0 invert" />
                            <p>{option.name}</p>
                        </div>
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
                    <p className="mb-1">x</p>
                </button>

                <div className="sidebar-header mb-3 mt-8 border-b border-gray-300 pb-4 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/profile")}>
                    <img src={userData ? userData.photo_url : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="User avatar" className="w-10 h-10 rounded-full shadow bg-white" />
                    <h2 className="text-xl font-bold tracking-wide hover:text-blue-400 transition">
                        {userData ? userData.name : "HourCheck"}
                    </h2>
                </div>

                {/* Sidebar móvil */}
                <nav className="flex flex-col gap-4 flex-1">
                    {sidebarOptions.map((option) => (
                        <div
                            key={option.id}
                            className="hover:bg-secondary p-3 rounded transition text-primary hover:text-white flex items-center gap-4 cursor-pointer"
                            onClick={() => setVisible(false) || navigate(option.path)}
                        >
                            <img src={option.icon} alt={`${option.name} icon`} className="w-5 h-5 filter brightness-0 invert" />
                            <p>{option.name}</p>
                        </div>
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