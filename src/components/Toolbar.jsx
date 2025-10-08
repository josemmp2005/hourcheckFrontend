import homeIcon from '../assets/home-icon.svg';
import timerIcon from '../assets/timer-icon.svg';
import companiesIcon from '../assets/companies-icon.svg';
import breakIcon from '../assets/break-icon.svg';
import { useNavigate } from 'react-router-dom';

export default function Toolbar() {
    const navigate = useNavigate();
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white inset-shadow-sm border-t border-gray-300 p-4 flex justify-around lg:hidden rounded-t-xl">
            <div className="flex flex-col items-center" onClick={() => navigate("/select-company")}>
                <img src={companiesIcon} alt="Companies" className="w-8 h-8"  />
                <span className="text-xs">Companies</span>
            </div>
            <div className="flex flex-col items-center" onClick={() => navigate("/dashboard")}>
                <img src={homeIcon} alt="Home" className="w-8 h-8"  />
                <span className="text-xs">Dashboard</span>
            </div>
            <div className="flex flex-col items-center" onClick={() => navigate("/clock")}>
                <img src={timerIcon} alt="Timer" className="w-8 h-8"  />
                <span className="text-xs">Clock</span>
            </div>
            <div className="flex flex-col items-center" onClick={() => navigate("/break")}>
                <img src={breakIcon} alt="Break" className="w-8 h-8"  />
                <span className="text-xs">Break</span>
            </div>
        </div>
    );
}   