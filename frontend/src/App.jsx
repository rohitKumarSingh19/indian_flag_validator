import { useState } from "react";

export default function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    if (!e.target.files[0]) return;
    setLoading(true);
    setReport(null);

    const formData = new FormData();
    formData.append("flag", e.target.files[0]);

    try {
      const res = await fetch("http://localhost:5000/validate-flag", {
        method: "POST",
        body: formData,
      });
      setReport(await res.json());
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const renderStatus = (status) => {
    return status === "pass" ? (
      <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">
        ✅ Pass
      </span>
    ) : (
      <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-medium">
        ❌ Fail
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-green-50 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-2">
          🇮🇳 Indian Flag Validator
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Upload a flat Indian flag image to check BIS compliance.
        </p>

        {/* File Upload Box */}
        <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <p className="text-gray-500">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
        </label>

        {loading && (
          <p className="text-center mt-4 text-blue-600 font-medium">
            Processing...
          </p>
        )}

        {report && (
          <div className="mt-6 space-y-4">
            {/* Aspect Ratio */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <div>
                <p className="font-medium">Aspect Ratio</p>
                <p className="text-sm text-gray-500">Actual: {report.aspect_ratio.actual}</p>
              </div>
              {renderStatus(report.aspect_ratio.status)}
            </div>

            {/* Colors */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2">Colors</p>
              <div className="space-y-1">
                {Object.entries(report.colors).map(([color, data]) => (
                  <div
                    key={color}
                    className="flex justify-between items-center"
                  >
                    <span className="capitalize">{color}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Deviation: {data.deviation}
                      </span>
                      {renderStatus(data.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stripe Proportion */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <div>
                <p className="font-medium">Stripe Proportion</p>
                <p className="text-sm text-gray-500">
                  Top: {report.stripe_proportion.top}, Middle:{" "}
                  {report.stripe_proportion.middle}, Bottom:{" "}
                  {report.stripe_proportion.bottom}
                </p>
              </div>
              {renderStatus(report.stripe_proportion.status)}
            </div>

            {/* Chakra Position */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <div>
                <p className="font-medium">Chakra Position</p>
                <p className="text-sm text-gray-500">
                  Offset X: {report.chakra_position.offset_x}, Offset Y:{" "}
                  {report.chakra_position.offset_y}
                </p>
              </div>
              {renderStatus(report.chakra_position.status)}
            </div>

            {/* Chakra Spokes */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <div>
                <p className="font-medium">Chakra Spokes</p>
                <p className="text-sm text-gray-500">
                  Detected: {report.chakra_spokes.detected || "N/A"}
                </p>
              </div>
              {renderStatus(report.chakra_spokes.status)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
