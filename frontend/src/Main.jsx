import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

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

function GraficoTrayectoria({ trazado }) {
  const [lapSelected, setLapSelected] = useState(null);

  if (!trazado || !trazado.x || !trazado.y || !trazado.currentLap) {
    return <p>No hay datos de trazado.</p>;
  }

  const lapNumbers = Array.from(new Set(trazado.currentLap)).sort((a, b) => a - b);

  // Genera datasets para cada vuelta
  const datasets = lapNumbers.map((lap, idx) => {
    const indices = trazado.currentLap
      .map((l, i) => (lapSelected === null || l === lap ? i : null))
      .filter((i) => i !== null);
    return {
      label: `Vuelta ${lap + 1}`,
      data: indices.map((i) => ({ x: trazado.x[i], y: trazado.y[i] })),
      borderColor: ["#c00", "#cc0", "#0c0", "#0cc", "#00c", "#c0c"][idx % 6],
      fill: false,
      pointRadius: 0,
      borderWidth: 2,
      hidden: lapSelected !== null && lapSelected !== lap,
    };
  });

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button
          onClick={() => setLapSelected(null)}
          style={{
            fontWeight: lapSelected === null ? "bold" : "normal",
            marginRight: 4,
          }}
        >
          Todas
        </button>
        {lapNumbers.map((lap) => (
          <button
            key={lap}
            onClick={() => setLapSelected(lap)}
            style={{
              fontWeight: lapSelected === lap ? "bold" : "normal",
              marginRight: 4,
            }}
          >
            Vuelta {lap + 1}
          </button>
        ))}
      </div>
      <div style={{ maxWidth: 700, minHeight: 400 }}>
        <Line
          data={{ datasets }}
          options={{
            responsive: true,
            aspectRatio: 1,
            maintainAspectRatio: true,
            scales: {
              x: { type: "linear", title: { display: true, text: "X" } },
              y: { type: "linear", title: { display: true, text: "Y" } },
            },
            plugins: {
              legend: { display: true, position: "right" },
              title: { display: false },
            },
          }}
        />
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:8000/upload-replay/", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Subir Replay</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? "Cargando..." : "Subir y analizar"}
      </button>

      {data && (
        <>
          <h2>Resumen</h2>
          <pre style={{ background: "#f8f8f8", padding: 10 }}>
            {JSON.stringify(data.resumen, null, 2)}
          </pre>
          <h2>Tiempos de vuelta</h2>
          <TablaVueltas laps={data.laps} />
          <h2>Gráfico de Trayectoria 2D</h2>
          <GraficoTrayectoria trazado={data.trazado} />
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
