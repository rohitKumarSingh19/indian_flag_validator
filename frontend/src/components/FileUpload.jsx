import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setValidationResult(null); // clear previous result
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("flag", file);

      const res = await axios.post(
        "http://localhost:5000/api/flags/upload/validate",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setValidationResult(res.data); // backend sends { valid, message }
    } catch (err) {
      console.error("Upload error:", err);
      setValidationResult({
        valid: false,
        message: "Error uploading file. Please try again.",
      });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Indian Flag Validator</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <br />
        <button
          type="submit"
          disabled={!file || loading}
          style={{ marginTop: "10px" }}
        >
          {loading ? "Validating..." : "Upload & Validate"}
        </button>
      </form>

      {validationResult && (
        <div style={{ marginTop: "20px" }}>
          {validationResult.valid ? (
            <p style={{ color: "green", fontWeight: "bold" }}>
              ✅ Flag is valid
            </p>
          ) : (
            <p style={{ color: "red", fontWeight: "bold" }}>
              ❌ Flag is invalid
            </p>
          )}
          <p>{validationResult.message}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
