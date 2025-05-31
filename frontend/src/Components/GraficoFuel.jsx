import React from "react";
import { Line } from "react-chartjs-2";

function GraficoFuel({ data }) {
  if (!data || !data.fuel) return <p>No hay datos de Combustible.</p>;

  return (
    <div>
      <h3>Gráfico de Combustible</h3>
      <div style={{ maxWidth: 700, minHeight: 400, background: "#fff", border: "1px solid #ccc", borderRadius: 8, padding: 8 }}>
        <Line
          data={{
            labels: data.fuel.map((_, i) => i),
            datasets: [
              {
                label: "Combustible",
                data: data.fuel,
                borderColor: "#cc0",
                backgroundColor: "#fffaaf",
                pointRadius: 0,
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              y: {
                title: { display: true, text: "Litros" },
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

export default GraficoFuel;