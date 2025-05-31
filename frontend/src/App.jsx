import React, { useState } from "react";
import ResumenReplay from "./Components/ResumenReplay";
import TablaVueltas from "./Components/TablaVueltas";
import GraficoTrazado from "./Components/GraficoTrazado";
import GraficoRpmMarcha from "./Components/GraficoRpmMarcha";
import GraficoGasBrake from "./Components/GraficoGasBrake";
import GraficoFuel from "./Components/GraficoFuel";

function App() {
  const [resumen, setResumen] = useState(null);
  const [tab, setTab] = useState("trayectoria");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/upload-replay/", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Error al subir el archivo");
      const data = await res.json();
      setResumen(data);
    } catch (err) {
      alert("No se pudo procesar el archivo: " + err.message);
      setResumen(null);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ fontWeight: "bold", fontSize: "2.5rem", marginBottom: 20 }}>AC Replay</h1>
      <h2>Subir Replay</h2>
      <input type="file" onChange={handleUpload} />
      {!resumen && <p>Sube un replay para ver el resumen y los gráficos.</p>}
      {resumen && (
        <>
          <h2>Resumen</h2>
          <ResumenReplay resumen={resumen.resumen} />
          <h2>Tiempos de vuelta</h2>
          <TablaVueltas laps={resumen.laps} />
          <div style={{ marginBottom: 16 }}>
            <button onClick={() => setTab("trayectoria")}>Trayectoria</button>
            <button onClick={() => setTab("rpm_marcha")}>RPM/Marcha</button>
            <button onClick={() => setTab("gas_brake")}>Acelerador/Freno</button>
            <button onClick={() => setTab("fuel")}>Combustible</button>
          </div>
          {tab === "trayectoria" && <GraficoTrazado trazado={resumen.trazado} />}
          {tab === "rpm_marcha" && <GraficoRpmMarcha data={resumen.rpm_marcha} trazado={resumen.trazado} />}
          {tab === "gas_brake" && <GraficoGasBrake data={resumen.gas_brake} trazado={resumen.trazado} />}
          {tab === "fuel" && <GraficoFuel data={resumen.fuel} trazado={resumen.trazado} />}
        </>
      )}
    </div>
  );
}

export default App;
