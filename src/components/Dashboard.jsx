import Header from './Header';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role_id");
    // console.log("Role ID:", role);

    const adminOptions = {
        "Clock In": "/clock-in",
        "Break": "/break",
        "Absences": "/absences",
        "Vacations": "/vacations",
        "Info": "/info",
        "Admin Panel": "/admin-panel"
    };
    const managerOptions = {
        "Clock In": "/clock-in",
        "Break": "/break",
        "Absences": "/absences",
        "Vacations": "/vacations",
        "Info": "/info",
        "Manager Panel": "/manager"
    };
    const userOptions = {
        "Clock In": "/clock-in",
        "Break": "/break",
        "Absences": "/absences",
        "Vacations": "/vacations",
        "Info": "/info"
    };

    let dashboardOptions = {};

    if (role === "2") {
        dashboardOptions = adminOptions;
    } else if (role === "3") {
        dashboardOptions = managerOptions;
    } else if (role === "4") {
        dashboardOptions = userOptions;
    }

    if (dashboardOptions) { 
        return (
            <>
                <Header />
                <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
                    <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full">
                        <h1 className="text-3xl font-bold text-blue-700 mb-8">Dashboard</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            {Object.entries(dashboardOptions).map(([label, path]) => (
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
}