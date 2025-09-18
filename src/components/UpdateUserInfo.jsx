import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "./Header.jsx";
import logo from "../assets/logo.png";


export default function UpdateUserInfo() {
    const { img, setImg } = useState("");
    const { name, setName } = useState("");
    const { passwordHash, setPasswordHash } = useState("");
    const { confirmPasswordHash, setConfirmPasswordHash } = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleUpdateUserInfo = async (e) => {
        e.preventDefault();
        setError("");


    }


    return (
        <>
            <Header />
            <div className="card bg-white w-8/10 h-8/10 border-2 border-gray-300 rounded-2xl mt-10 pb-10 max-w-[350px] max-h-fit justify-self-center mx-auto">

                <div className="card-content">
                    <div className="photo pt-10 pb-5 flex justify-center">
                        <img
                            className="w-20 h-20 rounded-full object-cover"
                            src={logo}
                            alt="Foto de perfil"
                        />
                    </div>
                    <div className="subtitle flex justify-center">
                        <h2 className="text-l font-semibold">Actualizar Perfil</h2>
                    </div>
                    <form className="form flex flex-col items-center w-full" onSubmit={handleUpdateUserInfo}>
                        <div className="input-container flex flex-col mt-20 mb-10 rounded-md w-full pl-10 pr-10">
                            <input
                                className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                                type="text"
                                id="name"
                                placeholder="Elige un nombre"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>

    )
}