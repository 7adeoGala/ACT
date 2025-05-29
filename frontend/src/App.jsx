import React, { useState } from "react";
import ResumenReplay from "./Components/ResumenReplay";
import GraficoTrazado from "./Components/GraficoTrazado";
import GraficoRpmMarcha from "./Components/GraficoRpmMarcha";
import GraficoGasBrake from "./Components/GraficoGasBrake";
import GraficoFuel from "./Components/GraficoFuel";

function App() {
  const [resumen, setResumen] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/upload-replay/", { method: "POST", body: formData });
    const data = await res.json();
    setResumen(data);
  };

  return (
    <div>
      <h1>ACT – Visualizador de Replays</h1>
      <input type="file" onChange={handleUpload} />
      {!resumen && <p>Sube un replay para ver el resumen y los gráficos.</p>}
      {resumen && (
        <>
          <ResumenReplay resumen={resumen} />
          <GraficoTrazado resumen={resumen} />
          <GraficoRpmMarcha resumen={resumen} />
          <GraficoGasBrake resumen={resumen} />
          <GraficoFuel resumen={resumen} />
        </>
      )}
    </div>
  );
}

export default App;
