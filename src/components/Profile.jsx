import Header from './Header';
import { useEffect, useState } from 'react';
import { createClient } from "@supabase/supabase-js";
import API_BASE_URL from '../config/api.js';

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
            const response = await fetch(`${API_BASE_URL}/users/info`, {
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
        if (password && password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        let photo_url = userData?.photo_url || "";

        if (!userData?.email) {
            setError("El usuario no está cargado aún, intenta de nuevo.");
            return;
        }
        // Subir imagen a Supabase si hay nueva imagen
        if (photoFile) {
            const fileExt = photoFile.name.split('.').pop();
            const fileName = `${userData.email}_${Date.now()}.${fileExt}`;
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

        // Solo incluir los campos que se han modificado
        const updateBody = {};
        if (name && name !== userData.name) updateBody.name = name;
        if (password) updateBody.password_hash = password;
        if (photo_url && photo_url !== userData.photo_url) updateBody.photo_url = photo_url;
        updateBody.email = userData.email; // siempre necesario para identificar el usuario

        if (Object.keys(updateBody).length <= 1) {
            setError("No hay cambios para actualizar.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updateBody)
            });

            if (!response.ok) throw new Error("Error al actualizar la información");
            alert("Información actualizada correctamente");
            getUserData();
        } catch (error) {
            setError(error.message || "Error al actualizar la información");
        }
    };

    return (
        <section>
            <Header />
                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
                    <h1 className='text-3xl font-bold mb-6 text-primary text-center'>Mi Perfil</h1>
                    <form className="flex flex-col gap-4 w-full" onSubmit={handleUpdateUserInfo}>
                        <input
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition"
                            type="text"
                            placeholder="Nombre"
                            defaultValue={userData ? userData.name : ''}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <p className='border-b border-gray-300 px-4 py-2 text-sm text-gray-700'>
                            {userData ? userData.email : "Cargando..."}
                        </p>
                        <input
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition"
                            type="password"
                            placeholder="Nueva contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition"
                            type="password"
                            placeholder="Confirmar nueva contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <input
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPhotoFile(e.target.files[0])}
                        />
                        <button
                            type="submit"
                            disabled={!userData}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${userData
                                    ? "bg-primary text-white hover:bg-secondary"
                                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                }`}
                        >
                            Actualizar Información
                        </button>
                        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                    </form>
                </div>
        </section>
    );
}