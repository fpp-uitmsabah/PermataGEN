import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import { GeneratedImage } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface Props {
  originalImage: GeneratedImage;
  setEditedImage: (image: GeneratedImage | null) => void;
}

const ImageEditor: React.FC<Props> = ({ originalImage, setEditedImage }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter an edit instruction.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const image = await editImage(prompt, originalImage);
      setEditedImage(image);
    } catch (err) {
      setError('Failed to edit image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="3. Edit Your Logo (Optional)">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-instruction" className="block text-sm font-medium text-gray-700 mb-1">
            Edit Instruction
          </label>
          <input
            id="edit-instruction"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., make the coffee cup blue"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center"
        >
          {isLoading ? <Spinner /> : 'Apply Edit'}
        </button>
      </form>
    </Card>
  );
};

export default ImageEditor;
