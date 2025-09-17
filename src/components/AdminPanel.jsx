import Header from "./Header";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
    const navigate = useNavigate();

    const adminPanelOptions = {
        "Company Invitations": "/admin-panel/company-invitations",
        "Employees Management": "/admin-panel/employees-management",
        "Permission Management": "/admin-panel/permission-management",
        "Audit Logs": "/admin-panel/audit-logs",
        "Company Settings": "/admin-panel/company-settings",
        "Reports": "/admin-panel/reports"
    };

    return (
        <>
            <Header />
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
                <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full">
                    <h1 className="text-3xl font-bold text-blue-700 mb-8">Admin Panel</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {Object.entries(adminPanelOptions).map(([label, path]) => (
                            <button
                                key={label}
                                onClick={() => navigate(path)}
                                className="bg-blue-500 text-white py-3 rounded-xl shadow hover:bg-blue-600 transition-colors w-full text-center font-semibold"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
    