import Header from "./Header";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ClockIn() {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [cameraOpen, setCameraOpen] = useState(false);

    const handleOpenCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraOpen(true);
        } catch (err) {
            alert("No se pudo acceder a la cámara.");
        }
    };

    return (
        <>
            <Header />
            <div className="flex flex-col items-center mt-10">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition-colors mb-4"
                    onClick={handleOpenCamera}
                >
                    Abrir cámara
                </button>
                {cameraOpen && (
                    <video
                        ref={videoRef}
                        autoPlay
                        className="rounded-lg border shadow-lg w-80 h-60"
                    />
                )}
            </div>
        </>
    );
}