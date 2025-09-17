import Header from './Header';

export default function EmployeeManagement() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Gestión de Empleado</h2>
                {/* Aquí va el contenido específico para la gestión de un empleado */}
            </div>
        </div>
    );
}