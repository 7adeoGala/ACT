import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function GraficoGasBrake({ resumen }) {
  const [gasBrake, setGasBrake] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resumen) return;
    fetch("/grafico/gas-brake")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el gráfico");
        return res.json();
      })
      .then(setGasBrake)
      .catch(() => setError("No hay datos de Gas/Freno disponibles."));
  }, [resumen]);

  if (!resumen) return null;
  if (error) return <p>{error}</p>;
  if (!gasBrake || !gasBrake.gas || !gasBrake.brake)
    return <p>No hay datos de Gas/Freno.</p>;

  const data = {
    labels: gasBrake.gas.map((_, i) => i),
    datasets: [
      {
        label: "Acelerador",
        data: gasBrake.gas,
        borderColor: "green",
        pointRadius: 0,
      },
      {
        label: "Freno",
        data: gasBrake.brake,
        borderColor: "red",
        pointRadius: 0,
      },
    ],
  };

  return (
    <div>
      <h3>Gráfico Gas y Freno</h3>
      <Line data={data} />
    </div>
  );
}

export default GraficoGasBrake;