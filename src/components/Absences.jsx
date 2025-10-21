import Header from "./Header";
import { useState, useEffect } from "react";
import "cally";
import Toolbar from "./Toolbar.jsx";
import API_BASE_URL from "../config/api.js";

export default function Absences() {
  const [error, setError] = useState("");
  const [absences, setAbsences] = useState([]);
  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split('.')[1]));
  const userId = payload.userId || payload.id || payload.sub;
  const [dateRange, setDateRange] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const customizeButtons = () => {
      // console.log('Personalizando botones...');

      const calendarElement = document.querySelector('calendar-range');

      if (calendarElement && calendarElement.shadowRoot) {
        const shadowButtons = calendarElement.shadowRoot.querySelectorAll('button');
        // console.log('Encontrados botones:', shadowButtons.length);

        shadowButtons.forEach((button, index) => {
          const part = button.getAttribute('part');
          // console.log(`Procesando botón ${index} con part: ${part}`);

          if (part && part.includes('previous')) {
            // console.log('Personalizando botón Previous');
            // Cambiar solo el contenido del slot
            const slot = button.querySelector('slot[name="previous"]');
            if (slot) {
              slot.textContent = '<';
            }

            // Aplicar estilos
            button.style.cssText = `
                            font-size: 20px !important;
                            font-weight: bold !important;
                            width: 40px !important;
                            height: 40px !important;
                            border-radius: 50% !important;
                            background: #f3f4f6 !important;
                            border: 1px solid #d1d5db !important;
                            color: #374151 !important;
                            cursor: pointer !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            transition: all 0.2s ease !important;
                        `;
          }

          if (part && part.includes('next')) {
            // console.log('Personalizando botón Next');
            // Cambiar solo el contenido del slot
            const slot = button.querySelector('slot[name="next"]');
            if (slot) {
              slot.textContent = '>';
            }

            // Aplicar estilos
            button.style.cssText = `
                            font-size: 20px !important;
                            font-weight: bold !important;
                            width: 40px !important;
                            height: 40px !important;
                            border-radius: 50% !important;
                            background: #f3f4f6 !important;
                            border: 1px solid #d1d5db !important;
                            color: #374151 !important;
                            cursor: pointer !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            transition: all 0.2s ease !important;
                        `;
          }
        });

        // console.log('Personalización completada');
      } else {
        console.log('No se encontró calendar-range o shadowRoot');
      }
    };

    // Ejecutar después de que se renderice el calendario
    const timeouts = [100, 500, 1000, 2000].map(delay =>
      setTimeout(customizeButtons, delay)
    );

    // Observer para detectar cambios (cuando cambia de mes)
    const observer = new MutationObserver(() => {
      setTimeout(customizeButtons, 100);
    });

    // Observar cambios en el calendario
    const calendarElement = document.querySelector('calendar-range');
    if (calendarElement && calendarElement.shadowRoot) {
      observer.observe(calendarElement.shadowRoot, {
        childList: true,
        subtree: true
      });
    }

    return () => {
      timeouts.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);

  function handleRangeChange(event) {
    setDateRange(event.target.value);
  }

  const getAbsences = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/leave-types`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch absences");
      }
      const data = await response.json();
      setAbsences(data["data"]);
    } catch (error) {
      console.error("Error fetching absences:", error);
    }
  }


  useEffect(() => {
    getAbsences();
    const [start, end] = dateRange.split("/");
    setStartDate(start);
    setEndDate(end);
  }, [dateRange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = fetch(`${API_BASE_URL}/absences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: userId,
          leave_type_id: e.target.absenceType.value,
          start_date: startDate,
          end_date: endDate,
          reason: e.target.reason.value
        })
      });
    } catch (error) {
      console.error("Error creating absence:", error);
    }
    alert("Absence created successfully");
  }


  console.log("Fecha de inicio:", startDate);
  console.log("Fecha de fin:", endDate);
  console.log("Absences data:", absences);



  return (
    <section className="">
      <Header />
      <div className="pt-25 bg-background min-h-screen">

        <h1 className="text-2xl font-bold text-center mb-4">Absences</h1>

        <div className="flex justify-center">
          <calendar-range
            months={2}
            value={dateRange}
            onchange={handleRangeChange}
          >
            <calendar-month />
          </calendar-range>
        </div>

        <p className="mt-4 text-center">Rango seleccionado: {dateRange}</p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4 w-1/3 mx-auto">
          <select
            name="absenceType"
            id="absenceType"
            className="border border-gray-300 p-2 rounded w-full"
            required
          >
            <option value="" disabled selected>Selecciona tipo de ausencia</option>
            {absences.map((absence) => (
              <option key={absence.id} value={absence.id}>{absence.name}</option>
            ))}

          </select>
          <input type="text" name="reason" id="" placeholder="reason" className="border border-gray-300 p-2 rounded mt-2 w-full" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Submit</button>
        </form>
      </div>
      <Toolbar />
    </section>
  );
}
