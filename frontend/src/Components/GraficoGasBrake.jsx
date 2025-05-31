import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function GraficoGasBrake({ data }) {
  if (!data || !data.gas || !data.brake) return <p>No hay datos de Acelerador/Freno.</p>;

  const chartData = {
    labels: data.gas.map((_, i) => i),
    datasets: [
      {
        label: "Acelerador",
        data: data.gas,
        borderColor: "green",
        pointRadius: 0,
      },
      {
        label: "Freno",
        data: data.brake,
        borderColor: "red",
        pointRadius: 0,
      },
    ],
  };

  return (
    <div>
      <h3>Gráfico Gas y Freno</h3>
      <div
        style={{
          maxWidth: 700,
          minHeight: 400,
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 8,
        }}
      >
        <Line
          data={{
            labels: data.gas.map((_, i) => i),
            datasets: [
              {
                label: "Acelerador",
                data: data.gas,
                borderColor: "#0c0",
                backgroundColor: "#dfffda",
                pointRadius: 0,
                borderWidth: 2,
              },
              {
                label: "Freno",
                data: data.brake,
                borderColor: "#c00",
                backgroundColor: "#ffdada",
                pointRadius: 0,
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              y: {
                title: { display: true, text: "Porcentaje" },
                min: 0,
                max: 1,
                grid: { color: "#eee" },
              },
              x: {
                title: { display: true, text: "Muestra" },
                grid: { color: "#eee" },
              },
            },
            plugins: {
              legend: { display: true, position: "top" },
            },
          }}
        />
      </div>
    </div>
  );
}

export default GraficoGasBrake;