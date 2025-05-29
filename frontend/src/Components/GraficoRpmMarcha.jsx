import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function GraficoRpmMarcha({ resumen }) {
  const [rpmMarcha, setRpmMarcha] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resumen) return;
    fetch("/grafico/rpm-marcha")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el gráfico");
        return res.json();
      })
      .then(setRpmMarcha)
      .catch(() => setError("No hay datos de RPM/Marcha disponibles."));
  }, [resumen]);

  if (!resumen) return null;
  if (error) return <p>{error}</p>;
  if (!rpmMarcha || !rpmMarcha.rpm || !rpmMarcha.gear) return <p>No hay datos de RPM/Marcha.</p>;

  const data = {
    labels: rpmMarcha.rpm.map((_, i) => i),
    datasets: [
      {
        label: "RPM",
        data: rpmMarcha.rpm,
        borderColor: "red",
        yAxisID: "y",
        pointRadius: 0,
      },
      {
        label: "Marcha",
        data: rpmMarcha.gear,
        borderColor: "green",
        yAxisID: "y1",
        stepped: true,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    scales: {
      y: { type: "linear", position: "left", title: { display: true, text: "RPM" } },
      y1: { type: "linear", position: "right", title: { display: true, text: "Marcha" }, grid: { drawOnChartArea: false } },
    },
  };

  return (
    <div>
      <h3>Gráfico RPM y Marcha</h3>
      <Line data={data} options={options} />
    </div>
  );
}

export default GraficoRpmMarcha;