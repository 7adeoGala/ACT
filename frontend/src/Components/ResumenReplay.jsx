import React from "react";

const ocultar = [
  "Frames", "Objetos en pista", "Cantidad de autos", "Pilotos", "Car Skin ID: 00_rosso"
];

export default function ResumenReplay({ resumen }) {
  if (!resumen) return <div>NO HAY RESUMEN</div>;
  return (
    <table style={{ borderCollapse: "collapse", marginBottom: 30 }}>
      <tbody>
        {Object.entries(resumen)
          .filter(([key]) => !ocultar.some(oc => key.includes(oc)))
          .map(([key, value]) => (
            <tr key={key}>
              <td style={{ border: "1px solid #ccc", padding: 4, fontWeight: "bold" }}>{key}</td>
              <td style={{ border: "1px solid #ccc", padding: 4 }}>{value}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}