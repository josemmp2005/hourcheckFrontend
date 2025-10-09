import homeIcon from '../assets/icons/home-icon.svg';
import timerIcon from '../assets/icons/timer-icon.svg';
import companiesIcon from '../assets/icons/companies-icon.svg';
import breakIcon from '../assets/icons/break-icon.svg';
import { useNavigate } from 'react-router-dom';

export default function Toolbar() {
    const navigate = useNavigate();
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white inset-shadow-sm border-t border-gray-300 p-3 flex justify-around lg:hidden rounded-t-xl">
            <div className="flex flex-col items-center sm:flex-row sm:gap-3" onClick={() => navigate("/select-company")}>
                <img src={companiesIcon} alt="Companies" className="w-6 h-6"  />
                <span className="text-xs">Companies</span>
            </div>
            <div className="flex flex-col items-center sm:flex-row sm:gap-3" onClick={() => navigate("/dashboard")}>
                <img src={homeIcon} alt="Home" className="w-6 h-6"  />
                <span className="text-xs">Dashboard</span>
            </div>
            <div className="flex flex-col items-center sm:flex-row sm:gap-3" onClick={() => navigate("/clock")}>
                <img src={timerIcon} alt="Timer" className="w-6 h-6"  />
                <span className="text-xs">Clock</span>
            </div>
            <div className="flex flex-col items-center sm:flex-row sm:gap-3" onClick={() => navigate("/break")}>
                <img src={breakIcon} alt="Break" className="w-6 h-6"  />
                <span className="text-xs">Break</span>
            </div>
        </div>
    );
}   