import { Link } from "react-router-dom";
import SideBar from "./SideBar.jsx";

export default function Header() {

  const userImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <header className="header flex justify-between items-center px-6 py-4 bg-gray-900 shadow-lg">
        <SideBar />
        <div className="header-title">
          <Link to="/" className="text-white text-2xl font-bold tracking-wide hover:text-blue-400 transition">
            HourCheck
          </Link>
        </div>
      <div className="flex items-center gap-2">
        <img
          src={userImg}
          alt="User"
          className="user-img w-12 h-12 rounded-full border-2 border-blue-400 shadow"
        />
      </div>
    </header>
  );
}
