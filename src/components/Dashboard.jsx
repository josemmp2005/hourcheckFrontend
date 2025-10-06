import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import API_BASE_URL from '../config/api.js';
import Toolbar from './Toolbar.jsx';

export default function Dashboard() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role_id");
    const companyId = localStorage.getItem("company_id");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [dailyCode, setDailyCode] = useState("");

    const getDailyCode = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/daily-singing-code/${companyId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch daily singing code");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching daily singing code:", error);
        }
    };

    const generateQR = async (text) => {
        try {
            const url = await QRCode.toDataURL(text);
            setQrCodeUrl(url);
        } catch (err) {
            console.error("Error generating QR code:", err);
        }
    };

    useEffect(() => {
        if (role === "5") {
            const fetchAndGenerateQR = async () => {
                const data = await getDailyCode();
                if (data && data.code) {
                    setDailyCode(data.code);
                    generateQR(data.code);
                }
            };
            fetchAndGenerateQR();
        }
    }, [role]);

    // QR Generator for role 5
    if (role === "5") {
        return (
            <section className="lg:flex min-h-screen">
                <Header />
                <div className="h-100 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 lg:w-full" >
                    <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full">
                        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
                            📱 Código QR Diario
                        </h2>

                        {qrCodeUrl ? (
                            <div className="text-center">
                                <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
                                    <img
                                        src={qrCodeUrl}
                                        alt="QR Code"
                                        className="w-64 h-64 mx-auto"
                                    />
                                </div>
                                <p className="text-gray-600 text-sm mb-2">
                                    <strong>Código:</strong> {dailyCode}
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Los empleados deben escanear este código para registrar su entrada
                                </p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Generando código QR...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }


    return (
        <section className="lg:flex min-h-screen">
            <Header />
            <h1 className="text-3xl font-bold text-blue-700 mb-8">Dashboard</h1>
            <Toolbar />
        </section>
    );
}
    