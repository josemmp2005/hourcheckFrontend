import Header from './Header';
import { UseState, useEffect, UseRef } from 'react';
import  API_BASE_URL  from '../config/api.js';

export default function Break(){

    const breakStatusChecked = useRef(false);
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('companyId');
    const [breakStatus, setBreakStatus] = UseState(null); 

    const checkBreakStatus = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/break/status/${companyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();
            if (response.ok) {
                setBreakStatus(data.onBreak ? 'onBreak' : 'notOnBreak');
                breakStatusChecked.current = true;
            } else {
                throw new Error("Failed to fetch break status");
            }
        } catch (error) {
            console.error('Error fetching break status:', error);
        }
    }

    const startBreak = async () => {}

    const endBreak = async () => {}

    useEffect(() => {
        checkBreakStatus();
    }, []);

    return (
        <>
            <Header />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Descansos</h2>
                <p>Aquí puedes gestionar los descansos de los empleados.</p>
            </div>
        </>
    );
}
