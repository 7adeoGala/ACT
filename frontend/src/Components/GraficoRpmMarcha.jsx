import React from "react";
import { Line } from "react-chartjs-2";

function GraficoRpmMarcha({ data }) {
  if (!data || !data.rpm || !data.gear) return <p>No hay datos de RPM/Marcha.</p>;

  return (
    <div>
      <h3>Gráfico de RPM / Marcha</h3>
      <div style={{ maxWidth: 700, minHeight: 400, background: "#fff", border: "1px solid #ccc", borderRadius: 8, padding: 8 }}>
        <Line
          data={{
            labels: data.rpm.map((_, i) => i),
            datasets: [
              {
                label: "RPM",
                data: data.rpm,
                borderColor: "#c00",
                backgroundColor: "#ffdada",
                pointRadius: 0,
                borderWidth: 2,
                yAxisID: "rpm",
              },
              {
                label: "Marcha",
                data: data.gear,
                borderColor: "#00c",
                backgroundColor: "#dadcff",
                pointRadius: 0,
                borderWidth: 2,
                yAxisID: "gear",
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              rpm: {
                type: "linear",
                position: "left",
                title: { display: true, text: "RPM" },
                grid: { color: "#eee" },
              },
              gear: {
                type: "linear",
                position: "right",
                title: { display: true, text: "Marcha" },
                grid: { display: false },
                min: Math.min(...data.gear),
                max: Math.max(...data.gear),
                ticks: { stepSize: 1 },
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

export default GraficoRpmMarcha;