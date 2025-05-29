import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function GraficoTrazado({ resumen }) {
  const [trazado, setTrazado] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resumen) return;
    fetch("/grafico/trazado")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el trazado");
        return res.json();
      })
      .then(setTrazado)
      .catch(() => setError("No hay datos de trazado disponibles."));
  }, [resumen]);

  if (!resumen) return null;
  if (error) return <p>{error}</p>;
  if (
    !trazado ||
    !Array.isArray(trazado.x) ||
    !Array.isArray(trazado.y) ||
    trazado.x.length === 0 ||
    trazado.y.length === 0
  ) {
    return <p>No hay datos de trazado.</p>;
  }

  const data = {
    datasets: [
      {
        label: "Trayectoria (X vs Y)",
        data: trazado.x.map((x, i) => ({ x, y: trazado.y[i] })),
        borderColor: "blue",
        showLine: true,
        parsing: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    parsing: { xAxisKey: "x", yAxisKey: "y" },
    plugins: { legend: { display: true } },
    scales: { x: { title: { display: true, text: "X" } }, y: { title: { display: true, text: "Y" } } },
  };

  return (
    <div>
      <h3>Gráfico de Trazado</h3>
      <Line data={data} options={options} />
    </div>
  );
}

export default GraficoTrazado;