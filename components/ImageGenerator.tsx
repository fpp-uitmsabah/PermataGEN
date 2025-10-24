import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { GeneratedImage } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface Props {
  setLogo: (image: GeneratedImage | null) => void;
}

const ImageGenerator: React.FC<Props> = ({ setLogo }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedLogo, setGeneratedLogo] = useState<GeneratedImage | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a description for the logo.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setLogo(null);
    setGeneratedLogo(null);
    try {
      const image = await generateImage(prompt);
      setLogo(image);
      setGeneratedLogo(image);
    } catch (err) {
      setError('Failed to generate logo. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="2. Generate Your Logo">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="logo-description" className="block text-sm font-medium text-gray-700 mb-1">
            Logo Description
          </label>
          <input
            id="logo-description"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., a minimalist coffee cup icon with steam"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center"
        >
          {isLoading ? <Spinner /> : 'Generate Logo'}
        </button>
      </form>
      {generatedLogo && (
        <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-800">Generated Logo:</h3>
            <div className="mt-2 p-2 border rounded-md flex justify-center">
                 <img
                    src={`data:${generatedLogo.mimeType};base64,${generatedLogo.data}`}
                    alt="Generated Logo"
                    className="max-h-40"
                />
            </div>
        </div>
      )}
    </Card>
  );
};

export default ImageGenerator;
