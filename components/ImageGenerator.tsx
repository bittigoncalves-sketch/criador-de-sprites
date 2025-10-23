
import React, { useState } from 'react';
import { generateImageFromText } from '../services/geminiService';
import { Spinner } from './common/Spinner';
import { Button } from './common/Button';
import { Icon } from './Icon';

export const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt) {
            setError('Please enter a prompt to generate an image.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const resultUrl = await generateImageFromText(prompt, aspectRatio);
            setGeneratedImage(resultUrl);
        } catch (err) {
            console.error(err);
            setError('Failed to generate image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-sky-300 mb-1">AI Image Generator</h2>
            <p className="text-slate-400 mb-6">Create stunning, high-quality images from your imagination.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="imagePrompt" className="block text-sm font-medium text-slate-300 mb-2">Enter a detailed prompt</label>
                    <textarea
                        id="imagePrompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="e.g., 'A majestic phoenix rising from ashes, digital art, cinematic lighting'"
                    />
                </div>
                <div>
                     <label htmlFor="aspectRatio" className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
                     <select
                        id="aspectRatio"
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="w-full md:w-1/3 bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
                     >
                        <option value="1:1">1:1 (Square)</option>
                        <option value="16:9">16:9 (Widescreen)</option>
                        <option value="9:16">9:16 (Portrait)</option>
                        <option value="4:3">4:3 (Standard)</option>
                        <option value="3:4">3:4 (Tall)</option>
                     </select>
                </div>
                
                <div className="text-center pt-2">
                    <Button type="submit" disabled={isLoading || !prompt} size="lg">
                        {isLoading ? <Spinner /> : <Icon.Image className="w-5 h-5 mr-2" />}
                        Generate Image
                    </Button>
                </div>
            </form>

            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            
            {(isLoading || generatedImage) && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-sky-400 mb-4 text-center">Result</h3>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        {isLoading ? (
                            <div className="text-center h-64 flex flex-col justify-center items-center">
                                <Spinner size="lg"/>
                                <p className="mt-4 text-slate-300 animate-pulse">Generating your masterpiece...</p>
                            </div>
                        ) : generatedImage && (
                            <div className="flex flex-col items-center gap-4">
                                <img src={generatedImage} alt="Generated result" className="rounded-lg max-w-full md:max-w-lg max-h-[60vh] object-contain shadow-lg" />
                                <a href={generatedImage} download="generated-image.jpg">
                                    <Button>
                                        <Icon.Download className="w-5 h-5 mr-2" />
                                        Download Image
                                    </Button>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
