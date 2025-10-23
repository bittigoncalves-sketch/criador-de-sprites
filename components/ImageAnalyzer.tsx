
import React, { useState } from 'react';
import { analyzeImageContent } from '../services/geminiService';
import { ImageUploader } from './common/ImageUploader';
import { Spinner } from './common/Spinner';
import { Button } from './common/Button';
import { Icon } from './Icon';

export const ImageAnalyzer: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('Describe this image in detail.');
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile || !prompt) {
            setError('Please upload an image and provide a question or prompt.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const resultText = await analyzeImageContent(imageFile, prompt);
            setAnalysisResult(resultText);
        } catch (err) {
            console.error(err);
            setError('Failed to analyze image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-sky-300 mb-1">AI Image Analyzer</h2>
            <p className="text-slate-400 mb-6">Upload an image and ask questions to understand its content.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">1. Upload Image</label>
                        <ImageUploader onImageUpload={setImageFile} existingImage={imageFile} />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="analyzePrompt" className="block text-sm font-medium text-slate-300 mb-2">2. Ask a question about the image</label>
                            <textarea
                                id="analyzePrompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={4}
                                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
                                placeholder="e.g., 'What is the main subject?', 'Can you write a short story based on this image?'"
                            />
                        </div>
                        <div className="mt-4">
                            <Button type="submit" disabled={isLoading || !imageFile || !prompt} className="w-full">
                                {isLoading ? <Spinner /> : <Icon.Scan className="w-5 h-5 mr-2" />}
                                Analyze Image
                            </Button>
                        </div>
                    </form>
                </div>
                 <div className="bg-slate-900/50 rounded-lg p-4 h-full min-h-[300px] border border-slate-700">
                    <h3 className="text-lg font-semibold text-sky-400 mb-2">Analysis Result</h3>
                    {isLoading ? (
                         <div className="flex items-center justify-center h-full">
                            <Spinner size="lg" />
                         </div>
                    ) : error ? (
                         <p className="text-red-400">{error}</p>
                    ) : (
                         <p className="text-slate-300 whitespace-pre-wrap">{analysisResult || "Analysis will appear here..."}</p>
                    )}
                </div>
            </div>
        </div>
    );
};
