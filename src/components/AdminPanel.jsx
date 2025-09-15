import Header from "./Header";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
    const navigate = useNavigate();

    return (
        <>
            <Header />
        </>
    );
}