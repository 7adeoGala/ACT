import { useState } from "react";

function ReplayUploader() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:8000/upload-replay/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: "Error al subir la replay" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Subir replay de Assetto Corsa</h2>
      <input
        type="file"
        accept=".acReplay"
        onChange={handleFileChange}
        disabled={loading}
      />
      {loading && <p>Procesando replay...</p>}
      {response && (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default ReplayUploader;
