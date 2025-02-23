import React, { useState } from 'react';
import { classifyImage } from './api';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface Prediction {
  label: string;
  confidence: number;
}

interface ClassificationResult {
  predictions: Prediction[];
  message: string;
}

function FileUpload() {
  const [username, setUsername] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !username) {
      setError('Please provide both username and file');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await classifyImage(username, file);
      setResult(data);
    } catch (err) {
      setError('Failed to classify image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="eco-card p-8">
        <div className="flex items-center mb-6">
          <Upload className="w-8 h-8 text-eco-green-500 mr-3" />
          <h2 className="text-3xl font-bold text-eco-green-800">Upload Image</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="eco-input w-full"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-eco-green-200 rounded-lg hover:border-eco-green-300 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-eco-green-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-eco-green-600 hover:text-eco-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-eco-green-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="eco-button w-full"
          >
            {isLoading ? 'Classifying...' : 'Classify Image'}
          </button>
        </form>

        {error && (
          <div className="mt-6 flex items-center p-4 bg-red-50 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 eco-card p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-eco-green-500 mr-2" />
              <h3 className="text-xl font-semibold text-eco-green-700">Results</h3>
            </div>
            <p className="text-gray-600 mb-4">{result.message}</p>
            <ul className="space-y-2">
              {result.predictions.map((pred, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 bg-eco-green-50 rounded-lg"
                >
                  <span className="font-medium text-eco-green-800">{pred.label}</span>
                  <span className="text-eco-green-600">
                    {(pred.confidence * 100).toFixed(2)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;