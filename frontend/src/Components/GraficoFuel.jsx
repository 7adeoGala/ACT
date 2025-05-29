import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function GraficoFuel({ resumen }) {
  const [fuel, setFuel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resumen) return;
    fetch("/grafico/fuel")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el gráfico");
        return res.json();
      })
      .then(setFuel)
      .catch(() => setError("No hay datos de Combustible disponibles."));
  }, [resumen]);

  if (!resumen) return null;
  if (error) return <p>{error}</p>;
  if (!fuel || !fuel.fuel) return <p>No hay datos de Combustible.</p>;

  const data = {
    labels: fuel.fuel.map((_, i) => i),
    datasets: [
      {
        label: "Combustible",
        data: fuel.fuel,
        borderColor: "orange",
        pointRadius: 0,
      },
    ],
  };

  return (
    <div>
      <h3>Gráfico de Combustible</h3>
      <Line data={data} />
    </div>
  );
}

export default GraficoFuel;