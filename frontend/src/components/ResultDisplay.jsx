export default function ResultDisplay({ result }) {
  if (!result) return null; // don't show anything if no result yet

  return (
    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
      <h2>Validation Report</h2>
      {result.success ? (
        <div>
          <p style={{ color: "green" }}>✅ Flag is valid</p>
          <pre>{JSON.stringify(result.report, null, 2)}</pre>
        </div>
      ) : (
        <p style={{ color: "red" }}>❌ Validation failed</p>
      )}
    </div>
  );
}
