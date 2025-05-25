import React, { useState } from "react";
import axios from "axios";

function ReplayUploader() {
  const [response, setResponse] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload-replay/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data);
    } catch (err) {
      console.error("Error al subir replay:", err);
    }
  };

  return (
    <div>
      <input type="file" accept=".json,.txt,.lap" onChange={handleFileChange} />
      {response && (
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default ReplayUploader;

