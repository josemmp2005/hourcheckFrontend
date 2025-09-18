import Header from './Header.jsx'
import { useEffect } from 'react';

export default function CheckInvitation() {

    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    // console.log(token);
    const userToken = localStorage.getItem("token");

    const responseInvitation = async () => {
        try {
            const response = await fetch("http://localhost:3000/company-invitations/check-invitation", {
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
        } catch (error) {
            console.error("Error accepting invitation:", error);
        }
    }

    useEffect(() => {
        responseInvitation();
    }, []);

    return (
        <>
            <Header />
            <h1>Check Invitation</h1>
        </>
    )
}