import homeIcon from '../assets/home-icon.svg';
import timerIcon from '../assets/timer-icon.svg';
import companiesIcon from '../assets/companies-icon.svg';
import breakIcon from '../assets/break-icon.svg';


export default function Toolbar() {
    return (
        <div>
            <div className="fixed bottom-0 left-0 w-full bg-primary border-t shadow-md p-4 flex justify-around lg:hidden">
                <button className="">
                    <img src={companiesIcon} alt="Companies" className="w-6 h-6" />
                </button>
                <button className="">
                    <img src={homeIcon} alt="Home" className="w-6 h-6" />
                </button>
                <button className="">
                    <img src={timerIcon} alt="Timer" className="w-6 h-6" />
                </button>
                <button className="">
                    <img src={breakIcon} alt="Break" className="w-6 h-6" />
                </button>
            </div>  
        </div>
    );   
}   