import React from "react";

function ResumenReplay({ resumen }) {
  if (!resumen) return null;
  return (
    <div>
      <h2>Resumen del Replay</h2>
      <ul>
        {Object.entries(resumen).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {String(value)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResumenReplay;