import homeIcon from '../assets/icons/home-icon.svg';
import timerIcon from '../assets/icons/timer-icon.svg';
import companiesIcon from '../assets/icons/companies-icon.svg';
import breakIcon from '../assets/icons/break-icon.svg';
import absence from '../assets/icons/absence-icon.svg';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Toolbar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Función para verificar si la ruta está activa
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white inset-shadow-sm border-t border-gray-300 p-3 flex justify-around lg:hidden rounded-t-xl">
            <div 
                className={`flex flex-col items-center sm:flex-row sm:gap-3 cursor-pointer transition-colors duration-200 ${
                    isActive('/select-company') 
                        ? 'text-primary bg-blue-50 rounded-lg p-2' 
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg p-2'
                }`}
                onClick={() => navigate("/select-company")}
            >
                <img 
                    src={companiesIcon} 
                    alt="Companies" 
                    className={`w-6 h-6 transition-all duration-200 ${
                        isActive('/select-company') 
                            ? 'filter brightness-0 saturate-100 hue-rotate-210deg' 
                            : 'filter'
                    }`}
                />
                <span className="text-xs font-medium">Companies</span>
            </div>

            <div 
                className={`flex flex-col items-center sm:flex-row sm:gap-3 cursor-pointer transition-colors duration-200 ${
                    isActive('/dashboard') 
                        ? 'text-primary bg-blue-50 rounded-lg p-2' 
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg p-2'
                }`}
                onClick={() => navigate("/dashboard")}
            >
                <img 
                    src={homeIcon} 
                    alt="Home" 
                    className={`w-6 h-6 transition-all duration-200 ${
                        isActive('/dashboard') 
                            ? 'filter brightness-0 saturate-100 hue-rotate-210deg' 
                            : 'filter'
                    }`}
                />
                <span className="text-xs font-medium">Dashboard</span>
            </div>

            <div 
                className={`flex flex-col items-center sm:flex-row sm:gap-3 cursor-pointer transition-colors duration-200 ${
                    isActive('/clock') || isActive('/clock-in')
                        ? 'text-primary bg-blue-50 rounded-lg p-2' 
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg p-2'
                }`}
                onClick={() => navigate("/clock")}
            >
                <img 
                    src={timerIcon} 
                    alt="Timer" 
                    className={`w-6 h-6 transition-all duration-200 ${
                        isActive('/clock') || isActive('/clock-in')
                            ? 'filter brightness-0 saturate-100 hue-rotate-210deg' 
                            : 'filter'
                    }`}
                />
                <span className="text-xs font-medium">Clock</span>
            </div>

            <div 
                className={`flex flex-col items-center sm:flex-row sm:gap-3 cursor-pointer transition-colors duration-200 ${
                    isActive('/break') 
                        ? 'text-primary bg-blue-50 rounded-lg p-2' 
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg p-2'
                }`}
                onClick={() => navigate("/break")}
            >
                <img 
                    src={breakIcon} 
                    alt="Break" 
                    className={`w-6 h-6 transition-all duration-200 ${
                        isActive('/break') 
                            ? 'filter brightness-0 saturate-100 hue-rotate-210deg' 
                            : 'filter'
                    }`}
                />
                <span className="text-xs font-medium">Break</span>
            </div>
        </div>
    );
}