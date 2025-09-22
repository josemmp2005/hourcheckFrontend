import Header from "./Header";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";

export default function ClockIn() {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [qrResult, setQrResult] = useState("");

    const handleOpenCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraOpen(true);
        } catch (err) {
            alert("No se pudo acceder a la cámara.");
        }
    };

    // Escanea el QR cada 500ms cuando la cámara está abierta
    useEffect(() => {
        let interval;
        if (cameraOpen) {
            interval = setInterval(() => {
                if (
                    videoRef.current &&
                    canvasRef.current &&
                    videoRef.current.readyState === 4
                ) {
                    const video = videoRef.current;
                    const canvas = canvasRef.current;
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, canvas.width, canvas.height);
                    if (code) {
                        setQrResult(code.data);
                        clearInterval(interval);
                        // Opcional: detener la cámara después de leer el QR
                        if (video.srcObject) {
                            video.srcObject.getTracks().forEach(track => track.stop());
                        }
                        setCameraOpen(false);
                    }
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [cameraOpen]);

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
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            className="rounded-lg border shadow-lg w-80 h-60"
                        />
                        <canvas ref={canvasRef} style={{ display: "none" }} />
                    </>
                )}
                {qrResult && (
                    <div className="mt-4 p-4 bg-green-100 rounded shadow text-green-800">
                        <strong>QR detectado:</strong> {qrResult}
                    </div>
                )}
            </div>
        </>
    );
}