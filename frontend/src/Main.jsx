import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import GraficoTrazado from "./Components/GraficoTrazado";
import GraficoRpmMarcha from "./Components/GraficoRpmMarcha";
import GraficoGasBrake from "./Components/GraficoGasBrake";
import GraficoFuel from "./Components/GraficoFuel";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

function TablaVueltas({ laps }) {
  if (!laps || laps.length === 0) return <p>No hay datos de vueltas.</p>;
  return (
    <table style={{ borderCollapse: "collapse", marginBottom: 30 }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ccc", padding: 4 }}>Vuelta</th>
          <th style={{ border: "1px solid #ccc", padding: 4 }}>Tiempo</th>
          <th style={{ border: "1px solid #ccc", padding: 4 }}>Delta</th>
        </tr>
      </thead>
      <tbody>
        {laps.map((lap) => (
          <tr
            key={lap.lap_number}
            style={
              lap.delta === 0
                ? { background: "#d4ffd4", fontWeight: "bold" }
                : {}
            }
          >
            <td style={{ border: "1px solid #ccc", padding: 4 }}>{lap.lap_number}</td>
            <td style={{ border: "1px solid #ccc", padding: 4 }}>{lap.lap_time.toFixed(3)}s</td>
            <td style={{ border: "1px solid #ccc", padding: 4 }}>
              {lap.delta === 0 ? "-" : `+${lap.delta.toFixed(3)}s`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function App() {
  const [data, setData] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:8000/upload-replay/", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    console.log(json); // <-- Agregá esto
    setData(json);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Subir Replay</h2>
      <input type="file" onChange={handleUpload} />

      {data && (
        <>
          <h2>Resumen</h2>
          <pre style={{ background: "#f8f8f8", padding: 10 }}>
            {JSON.stringify(
              Object.fromEntries(
                Object.entries(data.resumen).filter(
                  ([k]) => !["trazado", "laps", "rpm_marcha", "gas_brake", "fuel"].includes(k)
                )
              ),
              null,
              2
            )}
          </pre>
          <h2>Tiempos de vuelta</h2>
          <TablaVueltas laps={data.laps} />
          <h2>Trayectoria</h2>
          <GraficoTrazado trazado={data.resumen.trazado} />
          <h2>RPM / Marcha</h2>
          <GraficoRpmMarcha data={data.resumen.rpm_marcha} />
          <h2>Acelerador / Freno</h2>
          <GraficoGasBrake data={data.resumen.gas_brake} />
          <h2>Combustible</h2>
          <GraficoFuel data={data.resumen.fuel} />
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
