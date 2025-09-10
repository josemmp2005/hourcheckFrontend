import Header from "./Header.jsx";
import {useState} from  "react";
import logo from "../assets/logo.svg";


export default function JoinExistingCompany() {
    const [error, setError] = useState("");

    const handleCheckInvitation = async (e) => {
        e.preventDefault();
        setError("");
    }
    

    return (
        <>
            <Header />
            <div>
                <img src={logo} alt="Logo" />
                <h1 className="center text-center">Joining Existing Company</h1>

                <form className="form flex flex-col items-center w-full" onSubmit={handleCheckInvitation}>
                    <div className="input-container flex flex-col mt-20 mb-10 rounded-md w-full pl-10 pr-10">
                        <input
                            className="input bg-none border-b-1 border-gray-300 p-2 text-sm focus:outline-none"
                            type="text"
                            id="invitation_code"
                            placeholder="Código de invitación"
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm mb-2">{error}</div>
                    )}
                    <div className="button-container flex flex-col">
                        <button className="btn" type="submit">
                            <p className="text-l text-white">Comprobar código</p>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
