import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ResultDisplay from "./components/ResultDisplay";
export default function App() {
  const [result, setResult] = useState(null);
  return (
    <div>
      <h1>Indian Flag Validator</h1>
      <FileUpload onResult={setResult} />
      {result && <ResultDisplay result={result} />}
    </div>
  );
}
