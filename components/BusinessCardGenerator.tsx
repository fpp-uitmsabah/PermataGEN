import React, { useState } from 'react';
import { generateBusinessCardData, fetchAndAnalyzeFacultyProfile } from '../services/geminiService';
import { BusinessCardData } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface Props {
  setCardData: (data: BusinessCardData) => void;
}

const BusinessCardGenerator: React.FC<Props> = ({ setCardData }) => {
  const [prompt, setPrompt] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a URL.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAndAnalyzeFacultyProfile(url);
      setCardData(data);
    } catch (err) {
      setError('Failed to fetch data from URL. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a description for your business.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateBusinessCardData(prompt);
      setCardData(data);
    } catch (err) {
      setError('Failed to generate business card. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="1. Create Your Card">
      <form onSubmit={handleFetch} className="space-y-4">
        <div>
          <label htmlFor="faculty-url" className="block text-sm font-medium text-gray-700 mb-1">
            Fetch from URL
          </label>
          <div className="flex space-x-2">
            <input
              id="faculty-url"
              type="url"
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., https://example.edu/faculty/jane-doe"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-purple-300 flex items-center justify-center"
            >
              {isLoading ? <Spinner /> : 'Fetch'}
            </button>
          </div>
        </div>
      </form>

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleManualSubmit} className="space-y-4">
        <div>
          <label htmlFor="business-description" className="block text-sm font-medium text-gray-700 mb-1">
            Describe Manually
          </label>
          <textarea
            id="business-description"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., A modern coffee shop in San Francisco specializing in artisanal espresso drinks and pastries. The owner is Jane Doe."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center"
        >
          {isLoading ? <Spinner /> : 'Generate Card Details'}
        </button>
      </form>
       {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </Card>
  );
};

export default BusinessCardGenerator;
