import Header from "./Header";
import { useNavigate } from "react-router-dom";

export default function ManagerPanel (){
    const navigate = useNavigate();

    return (
        <>
            <Header />
        </>
    );
}