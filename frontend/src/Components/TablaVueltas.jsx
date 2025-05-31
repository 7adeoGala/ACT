import React from "react";

export default function TablaVueltas({ laps }) {
  if (!laps || laps.length === 0) return <p>No hay datos de vueltas.</p>;
  return (
    <table style={{ borderCollapse: "collapse", marginBottom: 30 }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ccc", padding: 4 }}>Vuelta</th>
          <th style={{ border: "1px solid #ccc", padding: 4 }}>Tiempo</th>
          <th style={{ border: "1px solid #ccc", padding: 4 }}>Delta</th>
        </tr>
      </thead>
      <tbody>
        {laps.map((lap) => (
          <tr
            key={lap.lap_number}
            style={
              lap.delta === 0
                ? { background: "#d4ffd4", fontWeight: "bold" }
                : {}
            }
          >
            <td style={{ border: "1px solid #ccc", padding: 4 }}>{lap.lap_number}</td>
            <td style={{ border: "1px solid #ccc", padding: 4 }}>{lap.lap_time.toFixed(3)}s</td>
            <td style={{ border: "1px solid #ccc", padding: 4 }}>
              {lap.delta === 0 ? "-" : `+${lap.delta.toFixed(3)}s`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}