import logo from "../assets/logo.png";

export default function LoadingOverlay({ isVisible, message = "Cargando..." }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-12 shadow-2xl text-center">
        <div className="mb-4">
          <img 
            className="w-20 h-20 rounded-full object-cover mx-auto animate-pulse" 
            src={logo} 
            alt="logo" 
          />
        </div>
        
        <h3 className="text-xl font-semibold text-primary mb-4">HourCheck</h3>
        
        <div className="flex items-center justify-center mb-4">
          <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}