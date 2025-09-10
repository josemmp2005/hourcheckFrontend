import Header from './Header';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
                <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full">
                    <h1 className="text-3xl font-bold text-blue-700 mb-8">Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl shadow transition text-xl"
                            onClick={() => navigate('/clock-in')}
                        >
                            Clock IN
                        </button>
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 rounded-xl shadow transition text-xl"
                            onClick={() => navigate('/break')}
                        >
                            Break
                        </button>
                        <button
                            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-6 rounded-xl shadow transition text-xl"
                            onClick={() => navigate('/absences')}
                        >
                            Absences
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-6 rounded-xl shadow transition text-xl"
                            onClick={() => navigate('/vacations')}
                        >
                            Vacations
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

}