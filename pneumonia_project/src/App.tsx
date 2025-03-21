import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

type DetectionStatus = 'idle' | 'processing' | 'success' | 'error';
type Result = {
  prediction: 'Pneumonia' | 'Normal';
  confidence: number;
};

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<DetectionStatus>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    setError('');
    setStatus('processing');

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.onerror = () => {
      setError('Failed to read the image file');
      setStatus('error');
    };
    reader.readAsDataURL(file);

    // Process image with API
    handleDetection(file);
  };

  const handleDetection = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setStatus('success');
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process image');
      setStatus('error');
    }
  };

  const resetDetection = () => {
    setImage(null);
    setStatus('idle');
    setResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pneumonia Detection AI</h1>
          <p className="text-lg text-gray-600">
            Upload a chest X-ray image for instant pneumonia detection
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {status === 'idle' && !image && (
            <div
              className="border-4 border-dashed border-gray-200 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Upload X-ray Image</h3>
              <p className="text-gray-500">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400 mt-2">PNG, JPG up to 10MB</p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          )}

          {image && (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="relative">
                  <img
                    src={image}
                    alt="Uploaded X-ray"
                    className="rounded-lg w-full h-auto"
                  />
                  <button
                    onClick={resetDetection}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <div className="h-full flex flex-col justify-center">
                  {status === 'processing' && (
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Analyzing Image...
                      </h3>
                      <p className="text-gray-500">
                        Our AI model is processing your X-ray image
                      </p>
                    </div>
                  )}

                  {status === 'success' && result && (
                    <div className="text-center">
                      {result.prediction === 'Pneumonia' ? (
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                      ) : (
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      )}
                      <h3 className="text-2xl font-bold mb-4">
                        {result.prediction === 'Pneumonia' ? (
                          <span className="text-red-500">Pneumonia Detected</span>
                        ) : (
                          <span className="text-green-500">No Pneumonia Detected</span>
                        )}
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600 mb-2">Confidence Score</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              result.prediction === 'Pneumonia'
                                ? 'bg-red-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${result.confidence}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {result.confidence.toFixed(1)}% confidence
                        </p>
                      </div>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="text-center text-red-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Error</h3>
                      <p>{error || 'Failed to process the image. Please try again.'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Make sure both the frontend and backend servers are running, and your model file is properly placed in the server directory.</p>
        </div>
      </div>
    </div>
  );
}

export default App;