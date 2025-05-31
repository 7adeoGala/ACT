import React, { useState } from "react";
import { Line } from "react-chartjs-2";

export default function GraficoTrazado({ trazado }) {
  const [lapSelected, setLapSelected] = useState(null);

  if (!trazado || !trazado.x || !trazado.y || !trazado.currentLap) {
    return <p>No hay datos de trazado.</p>;
  }

  const lapNumbers = Array.from(new Set(trazado.currentLap)).sort((a, b) => a - b);

  // Rota 90° y vista desde arriba
  const rotate90 = (x, y) => [y, -x];

  const datasets = lapNumbers.map((lap, idx) => {
    const indices = trazado.currentLap
      .map((l, i) => (lapSelected === null || l === lap ? i : null))
      .filter((i) => i !== null);
    return {
      label: `Vuelta ${lap + 1}`,
      data: indices.map(i => {
        const [rx, ry] = rotate90(trazado.x[i], trazado.y[i]);
        return { x: rx, y: ry };
      }),
      borderColor: ["#c00", "#cc0", "#0c0", "#0cc", "#00c", "#c0c"][idx % 6],
      fill: false,
      pointRadius: 0,
      borderWidth: 2,
      hidden: lapSelected !== null && lapSelected !== lap,
    };
  });

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button
          onClick={() => setLapSelected(null)}
          style={{ fontWeight: lapSelected === null ? "bold" : "normal", marginRight: 4 }}
        >
          Todas
        </button>
        {lapNumbers.map((lap) => (
          <button
            key={lap}
            onClick={() => setLapSelected(lap)}
            style={{ fontWeight: lapSelected === lap ? "bold" : "normal", marginRight: 4 }}
          >
            Vuelta {lap + 1}
          </button>
        ))}
      </div>
      <div style={{ maxWidth: 700, minHeight: 400 }}>
        <Line
          data={{ datasets }}
          options={{
            responsive: true,
            aspectRatio: 1,
            maintainAspectRatio: true,
            scales: {
              x: { type: "linear", title: { display: true, text: "X" } },
              y: { type: "linear", title: { display: true, text: "Y" } },
            },
            plugins: {
              legend: { display: true, position: "right" },
              title: { display: false },
            },
          }}
        />
      </div>
    </div>
  );
}