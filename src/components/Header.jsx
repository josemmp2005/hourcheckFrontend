import { Link } from "react-router-dom";
import SideBar from "./SideBar.jsx";
import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api.js";
import logo from "../assets/logo.png";

export default function Header() {
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("company_id");
  const [userData, setUserData] = useState(null);
  const [companyData, setCompanyData] = useState(null);

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
    getUserData();
  }, []);

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

  return (
    <header className="header fixed top-0 w-full bg-white z-10 flex justify-between items-center px-2 py-2 lg:px-0 lg:py-0 shadow-md border bg-white border-b border-gray-200">
      <SideBar />
      <Link to="/" className="text-2xl font-bold tracking-wide hover:text-blue-400 transition lg:hidden">
        {companyData ? companyData.name : "HourCheck"}
      </Link>
      <img
        src={companyData && companyData.photo_url !== null ? companyData.photo_url : logo}
        alt="User"
        className="w-12 h-12 object-cover lg:hidden"
      />
    </header>
  );
}
