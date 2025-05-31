import React, { useState } from "react";
import GraficoTrazado from "./Components/GraficoTrazado";
import GraficoRpmMarcha from "./Components/GraficoRpmMarcha";
import GraficoGasBrake from "./Components/GraficoGasBrake";
import GraficoFuel from "./Components/GraficoFuel";

function App() {
  const [resumen, setResumen] = useState(null);
  const [tab, setTab] = useState("trayectoria");

  // Ejemplo de carga de datos (ajusta según tu fetch/upload)
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
    setResumen(json.resumen); // Solo el objeto resumen
  };

  console.log("RESUMEN:", resumen);

  if (!resumen) {
    return (
      <div style={{ padding: 30 }}>
        <h2>Subí un replay</h2>
        <input type="file" onChange={handleUpload} />
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setTab("trayectoria")}>Trayectoria</button>
        <button onClick={() => setTab("rpm_marcha")}>RPM/Marcha</button>
        <button onClick={() => setTab("gas_brake")}>Acelerador/Freno</button>
        <button onClick={() => setTab("fuel")}>Combustible</button>
      </div>
      {tab === "trayectoria" && <GraficoTrazado trazado={resumen.trazado} />}
      {tab === "rpm_marcha" && <GraficoRpmMarcha data={resumen.rpm_marcha} />}
      {tab === "gas_brake" && <GraficoGasBrake data={resumen.gas_brake} />}
      {tab === "fuel" && <GraficoFuel data={resumen.fuel} />}
    </div>
  );
}

export default App;
