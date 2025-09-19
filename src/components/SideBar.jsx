import { Link } from "react-router-dom";
import React, { useState, useRef } from "react";

export default function SideBar() {
    const [visible, setVisible] = useState(false);
    const sidebarRef = useRef(null);
    const role = localStorage.getItem("role_id");
    const adminOptions = {
        "Clock In": "/clock-in",
        "Break": "/break",
        "Absences": "/absences",
        "Vacations": "/vacations",
        "Info": "/info",
        "Admin Panel": "/admin-panel",
        "Select Company": "/select-company",
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
        "Profile": "/profile"

    };
    const userOptions = {
        "Clock In": "/clock-in",
        "Break": "/break",
        "Absences": "/absences",
        "Vacations": "/vacations",
        "Info": "/info",
        "Select Company": "/select-company",
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

    // Cierra el sidebar al hacer clic fuera
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
        <div className="relative">
            <button
                className="top-4 left-4 z-50 bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition"
                onClick={() => setVisible(true)}
            >
                ☰
            </button>
            <aside
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white shadow-lg z-40 flex flex-col p-4 transform transition-transform duration-300 ${visible ? "translate-x-0" : "-translate-x-full"}`}
                style={{ pointerEvents: visible ? "auto" : "none" }}
            >
                <button
                    className="absolute top-4 right-4 text-white text-xl bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 transition"
                    onClick={() => setVisible(false)}
                >
                    ×
                </button>
                <div className="sidebar-header mb-8 mt-8">
                    <h2 className="text-2xl font-bold">HourCheck</h2>
                </div>
                <nav className="flex flex-col gap-4">
                    {Object.entries(sidebarOptions).map(([name, path]) => (
                        <Link
                            key={name}
                            to={path}
                            className="hover:bg-gray-700 p-2 rounded transition"
                        >
                            {name}
                        </Link>
                    ))}

                </nav>
                <div className="mt-auto">
                    <button className="w-full bg-red-500 hover:bg-red-600 p-2 rounded mt-8" onClick={handleLogout}>Cerrar sesión</button>
                </div>
            </aside>
        </div>
    );
}