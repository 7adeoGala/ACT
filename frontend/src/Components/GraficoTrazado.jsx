import React from "react";
import { Line } from "react-chartjs-2";

function GraficoTrazado({ trazado }) {
  if (!trazado || !trazado.x || !trazado.z) {
    return <p>No hay datos de trazado.</p>;
  }

  // Giro 90° a la izquierda: x = -z, y = x
  const dataPoints = trazado.z.map((z, i) => ({
    x: -z,
    y: trazado.x[i]
  }));

  // Calcular rangos para ambos ejes
  const minX = Math.min(...dataPoints.map(p => p.x));
  const maxX = Math.max(...dataPoints.map(p => p.x));
  const minY = Math.min(...dataPoints.map(p => p.y));
  const maxY = Math.max(...dataPoints.map(p => p.y));

  // Hacer que ambos ejes tengan el mismo rango (escala 1:1)
  const rangeX = maxX - minX;
  const rangeY = maxY - minY;
  const range = Math.max(rangeX, rangeY);

  // Centrar el gráfico si los rangos son distintos
  const centerX = (maxX + minX) / 2;
  const centerY = (maxY + minY) / 2;

  const scaledMinX = centerX - range / 2;
  const scaledMaxX = centerX + range / 2;
  const scaledMinY = centerY - range / 2;
  const scaledMaxY = centerY + range / 2;

  return (
    <div>
      <h3>Gráfico de Trayectoria</h3>
      <div style={{
        maxWidth: 700,
        minHeight: 400,
        background: "linear-gradient(135deg, #f8f8ff 60%, #e0e0f0 100%)",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 8
      }}>
        <Line
          data={{
            datasets: [
              {
                label: "Trayectoria",
                data: dataPoints,
                borderColor: "#c00",
                backgroundColor: "rgba(255,255,255,0.8)",
                fill: false,
                pointRadius: 0,
                borderWidth: 2,
                tension: 0.2,
                showLine: true,
              }
            ]
          }}
          options={{
            responsive: true,
            aspectRatio: 1,
            maintainAspectRatio: true,
            scales: {
              x: {
                type: "linear",
                display: false, // Oculta el eje X y sus valores
                min: scaledMinX,
                max: scaledMaxX,
                grid: { display: false }, // Oculta el cuadriculado X
              },
              y: {
                type: "linear",
                display: false, // Oculta el eje Y y sus valores
                min: scaledMinY,
                max: scaledMaxY,
                grid: { display: false }, // Oculta el cuadriculado Y
              },
            },
            plugins: {
              legend: { display: false }, // Oculta la leyenda
              title: { display: false },
              tooltip: { enabled: false },
            },
          }}
        />
      </div>
    </div>
  );
}

export default GraficoTrazado;