import React, { useState, useEffect, useCallback } from 'react';
import { generateVideoFromImage, checkVideoOperationStatus } from '../services/geminiService';
import { ImageUploader } from './common/ImageUploader';
import { Spinner } from './common/Spinner';
import { Button } from './common/Button';
import { Icon } from './Icon';

const VEO_LOADING_MESSAGES = [
    "Warming up the digital director's chair...",
    "Choreographing pixels into motion...",
    "Rendering the opening scene...",
    "Applying cinematic magic...",
    "Polishing the final cut...",
    "Almost ready for the premiere...",
];

export const VideoGenerator: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(VEO_LOADING_MESSAGES[0]);
    const [apiKeySelected, setApiKeySelected] = useState(false);


    const checkApiKey = useCallback(async () => {
        try {
            if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
                setApiKeySelected(true);
            } else {
                setApiKeySelected(false);
            }
        } catch (e) {
            console.error("aistudio not available", e);
            setApiKeySelected(true); // Assume it's available in non-aistudio env
        }
    }, []);

    useEffect(() => {
        checkApiKey();
    }, [checkApiKey]);

    useEffect(() => {
        let interval: number;
        if (isLoading) {
            interval = window.setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = VEO_LOADING_MESSAGES.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % VEO_LOADING_MESSAGES.length;
                    return VEO_LOADING_MESSAGES[nextIndex];
                });
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleSelectKey = async () => {
        try {
            if (window.aistudio) {
                await window.aistudio.openSelectKey();
                setApiKeySelected(true); // Assume success to avoid race condition
            }
        } catch(e){
            setError("Could not open API key selection dialog.");
            console.error(e);
        }
    };


    const pollOperation = async (operation: any) => {
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            try {
                operation = await checkVideoOperationStatus(operation);
            } catch (err: any) {
                if(err.message?.includes("Requested entity was not found.")){
                    setError("API Key error. Please re-select your API key.");
                    setApiKeySelected(false);
                } else {
                    setError("An error occurred while checking video status.");
                }
                setIsLoading(false);
                return null;
            }
        }
        return operation;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile || !prompt) {
            setError('Please upload an image and provide a prompt for the video.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        setLoadingMessage(VEO_LOADING_MESSAGES[0]);

        try {
            let initialOperation = await generateVideoFromImage(imageFile, prompt, aspectRatio);
            const finalOperation = await pollOperation(initialOperation);

            if (finalOperation?.response?.generatedVideos?.[0]?.video?.uri) {
                const downloadLink = finalOperation.response.generatedVideos[0].video.uri;
                
                // FIX: The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
                // The previous implementation using `window.aistudio.getApiKey()` is incorrect.
                const apiKey = process.env.API_KEY;

                if (!apiKey) {
                    throw new Error('API Key is not available to download the video.');
                }

                // Append the fetched API key to the download URL
                const response = await fetch(`${downloadLink}&key=${apiKey}`);
                if (!response.ok) {
                    throw new Error(`Failed to download video: ${response.statusText}`);
                }
                const videoBlob = await response.blob();
                setVideoUrl(URL.createObjectURL(videoBlob));
            } else {
                throw new Error('Video generation did not return a valid URL.');
            }
        } catch (err: any) {
            console.error(err);
             if(err.message?.includes("API key not valid")){
                setError("API Key is not valid. Please select a valid key.");
                setApiKeySelected(false);
            } else {
                setError(err.message || 'Failed to generate video. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!apiKeySelected) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-sky-300 mb-2">Veo Video Generation</h2>
                 <p className="text-slate-400 mb-4">This feature requires an API key to proceed.</p>
                 <p className="text-slate-400 mb-6 text-sm">Please select an API key. For more information on billing, visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">Google AI billing docs</a>.</p>
                 <Button onClick={handleSelectKey}>
                    <Icon.Key className="w-5 h-5 mr-2" />
                    Select API Key
                </Button>
                 {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-sky-300 mb-1">AI Video Generator</h2>
            <p className="text-slate-400 mb-6">Create a short video from a starting image and a text prompt.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">1. Upload Starting Image</label>
                        <ImageUploader onImageUpload={setImageFile} existingImage={imageFile} />
                    </div>
                     <div>
                        <label htmlFor="videoPrompt" className="block text-sm font-medium text-slate-300 mb-2">2. Describe Video Scene</label>
                        <textarea
                            id="videoPrompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
                            placeholder="e.g., 'A cinematic zoom out revealing a vast landscape', 'The character waves at the camera'"
                        />
                         <label htmlFor="aspectRatio" className="block text-sm font-medium text-slate-300 mb-2 mt-4">3. Aspect Ratio</label>
                         <select
                            id="aspectRatio"
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
                         >
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="9:16">9:16 (Portrait)</option>
                         </select>
                    </div>
                </div>

                <div className="text-center">
                    <Button type="submit" disabled={isLoading || !imageFile || !prompt} size="lg">
                        {isLoading ? <Spinner /> : <Icon.Video className="w-5 h-5 mr-2" />}
                        Generate Video
                    </Button>
                </div>
            </form>

            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            
            {(isLoading || videoUrl) && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-sky-400 mb-4 text-center">Generated Video</h3>
                    <div className="flex justify-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        {isLoading ? (
                            <div className="text-center">
                                <Spinner size="lg"/>
                                <p className="mt-4 text-slate-300 animate-pulse">{loadingMessage}</p>
                                <p className="text-sm text-slate-500 mt-2">(Video generation can take a few minutes)</p>
                            </div>
                        ) : videoUrl && (
                             <div className="flex flex-col items-center gap-4">
                                <video src={videoUrl} controls autoPlay loop className="rounded-lg max-w-full md:max-w-md max-h-[50vh] shadow-lg" />
                                <a href={videoUrl} download="generated-video.mp4">
                                    <Button>
                                        <Icon.Download className="w-5 h-5 mr-2" />
                                        Download Video
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
