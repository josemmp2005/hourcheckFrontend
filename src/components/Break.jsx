import Header from './Header';

export default function Break(){
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
