import Header from "./Header.jsx";
import { useState } from "react";

export default function CreateCompany() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [emailContact, setEmailContact] = useState("");
    const [logoPhotoUrl, setLogoPhotoUrl] = useState("");
    const [error, setError] = useState("");
    

    const handleCreateCompany = async (e) => {
        e.preventDefault();
        setError("");


    }


    return (
        <>
            <Header />
            <div>
                <h1>Create New Company</h1>
                <form className="form flex flex-col items-center w-full" onSubmit={handleCreateCompany}>
                    <input
                        className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                        type="text"
                        placeholder="Nombre de la empresa"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                        type="text"
                        placeholder="Dirección"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <input
                        className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                        type="tel"
                        placeholder="Teléfono"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                        type="email"
                        placeholder="Correo electrónico de contacto"
                        value={emailContact}
                        onChange={(e) => setEmailContact(e.target.value)}
                    />
                    <input
                        className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                        type="text"
                        placeholder="URL del logo"
                        value={logoPhotoUrl}
                        onChange={(e) => setLogoPhotoUrl(e.target.value)}
                    />
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Crear Empresa</button>
                </form>
            </div>
        </>
    );
}
