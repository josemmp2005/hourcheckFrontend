import Header from './Header';
import { useEffect, useState } from 'react';
import { createClient } from "@supabase/supabase-js";


const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);


export default function Profile() {
    const token = localStorage.getItem("token");
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [photoFile, setPhotoFile] = useState(null);

    const getUserData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/users/info`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("Failed to fetch user data");
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    const handleUpdateUserInfo = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        let photo_url = userData?.photo_url || "";

        // Subir imagen a Supabase si hay nueva imagen
        if (photoFile) {
            const fileExt = photoFile.name.split('.').pop();
            const fileName = `${userData.id}_${Date.now()}.${fileExt}`;
            const { data, error: uploadError } = await supabase
                .storage
                .from('img')
                .upload(fileName, photoFile, {
                    cacheControl: '3600',
                    upsert: false
                });
            if (uploadError) {
                setError("Error subiendo la imagen: " + uploadError.message);
                return;
            }
            // Obtener la URL pública
            const { data: publicUrlData } = supabase
                .storage
                .from('img')
                .getPublicUrl(fileName);
            photo_url = publicUrlData.publicUrl;
        }

        try {
            const response = await fetch("http://localhost:3000/users/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    password_hash: password,
                    photo_url,
                    email: userData.email
                })
            });

            if (!response.ok) throw new Error("Error al actualizar la información");
            alert("Información actualizada correctamente");
            getUserData();
        } catch (error) {
            setError(error.message || "Error al actualizar la información");
        }
    }

    return (
        <>
            <Header />
            <h1 className='text-center'>Profile</h1>
            <form className="form flex flex-col items-center w-full" onSubmit={handleUpdateUserInfo}>
                <input
                    className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                    type="text"
                    placeholder="Nombre"
                    defaultValue={userData ? userData.name : ''}
                    onChange={(e) => setName(e.target.value)}
                />
                <p className='bg-none border-b-1 border-gray-300 p-2 text-sm'>
                    {userData ? userData.email : "Cargando..."}
                </p>
                <input
                    className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                    type="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                    type="password"
                    placeholder="Confirmar nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <input
                    className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFile(e.target.files[0])}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Actualizar Información
                </button>
                {error && <p className="error text-red-500 mt-2">{error}</p>}
            </form>
        </>
    );
}