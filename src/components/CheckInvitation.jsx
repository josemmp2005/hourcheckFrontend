import Header from './Header.jsx'
import { useEffect } from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../config/api.js";

export default function CheckInvitation() {
    const navigate = useNavigate();
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const userToken = localStorage.getItem("token");

    useEffect(() => {
        if (!userToken) {
            localStorage.setItem("invitation-token", token);
            navigate('/login');
            return;
        }
        const responseInvitation = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/company-invitations/check-invitation`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`
                    },
                    body: JSON.stringify({ token })
                });
                if (!response.ok) {
                    throw new Error("Failed to accept invitation");
                }
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error("Error accepting invitation:", error);
            }
        };
        responseInvitation();
    }, [userToken, navigate, token]);

    return (
        <>
            <Header />
            <h1>Check Invitation</h1>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <div className="flex justify-center mb-6">
                        <img src={logo} alt="Logo" className="h-12" />
                    </div>
                </div>
            </div>
        </>
    );
}