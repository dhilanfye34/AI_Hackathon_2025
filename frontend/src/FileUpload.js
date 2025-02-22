import React, { useState } from 'react';
import { classifyImage } from '@/api'; // import the function we wrote
import { Alert, AlertDescription } from '@/components/ui/alert';
// ... other imports

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");   // the user who is uploading
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !username) {
      setError("Please select a file and enter a username!");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults(null);

    try {
      const data = await classifyImage(username, file);
      if (data.error) {
        setError(data.error);
      } else {
        // data might look like:
        // {
        //   "predictions": [
        //     {
        //       "label": "Plastic",
        //       "confidence": 0.87,
        //       "bbox": [x1, y1, x2, y2]
        //     }, ...
        //   ],
        //   "message": "1 point awarded to 'bob'"
        // }
        setResults(data);
      }
    } catch (err) {
      setError("Something went wrong. " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800">
              Upload an Image for Classification
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isLoading && !results && (
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">Username</label>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-green-600 mb-4" />
                  <p className="text-gray-600 mb-4">
                    Drag and drop your image here, or click to browse
                  </p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4
                               file:rounded file:border-0
                               file:text-sm file:font-semibold
                               file:bg-green-200 file:text-green-700
                               hover:file:bg-green-300"
                  />
                  <button
                    type="submit"
                    className="block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mx-auto"
                  >
                    Classify
                  </button>
                </div>
              </form>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Processing your image...</p>
              </div>
            )}

            {results && !isLoading && (
              <div className="space-y-6">
                {/* Show predictions */}
                <h3 className="text-xl font-semibold text-green-800">
                  Predictions
                </h3>
                <ul className="list-disc list-inside">
                  {results.predictions.map((pred, idx) => (
                    <li key={idx}>
                      <strong>{pred.label}</strong> - Confidence: {(pred.confidence * 100).toFixed(2)}%
                    </li>
                  ))}
                </ul>

                {/* Show message from the backend */}
                {results.message && (
                  <Alert>
                    <AlertDescription>{results.message}</AlertDescription>
                  </Alert>
                )}

                <button
                  onClick={() => {
                    setFile(null);
                    setResults(null);
                    setError("");
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Upload Another Image
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileUpload;
