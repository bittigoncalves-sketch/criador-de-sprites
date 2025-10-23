
import React, { useState, useEffect } from 'react';
import { generateSpriteSheet, generateImageFromText } from '../services/geminiService';
import { ImageUploader } from './common/ImageUploader';
import { Spinner } from './common/Spinner';
import { Button } from './common/Button';
import { Icon } from './Icon';
import type { Sprite } from '../types';

export const SpriteGenerator: React.FC = () => {
    const [referenceImage, setReferenceImage] = useState<File | null>(null);
    const [characterName, setCharacterName] = useState('');
    const [animationPrompt, setAnimationPrompt] = useState('side-scrolling walk cycle');
    const [generatedSprites, setGeneratedSprites] = useState<Sprite[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inputMode, setInputMode] = useState<'upload' | 'text'>('upload');
    const [isGeneratingRef, setIsGeneratingRef] = useState(false);
    const [spriteSheetUrl, setSpriteSheetUrl] = useState<string | null>(null);

    const handleGenerateRefImage = async () => {
        if (!characterName) {
            setError('Please enter a character name.');
            return;
        }
        setIsGeneratingRef(true);
        setError(null);
        try {
            const prompt = `Full body shot of a video game character named "${characterName}", side view, simple style for sprite sheet animation, on a solid neutral background.`;
            const imageUrl = await generateImageFromText(prompt, "1:1");
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], "generated_ref.jpg", { type: "image/jpeg" });
            setReferenceImage(file);
        } catch (err) {
            console.error(err);
            setError('Failed to generate reference image. Please try again.');
        } finally {
            setIsGeneratingRef(false);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!referenceImage || !animationPrompt) {
            setError('Please provide a reference image and an animation description.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedSprites([]);

        try {
            const imageUrls = await generateSpriteSheet(referenceImage, animationPrompt, 4);
            setGeneratedSprites(imageUrls.map((url, i) => ({ id: `sprite-${i}`, url })));
        } catch (err) {
            console.error(err);
            setError('Failed to generate sprites. Please check your inputs and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (generatedSprites.length > 0) {
            const combineSprites = async () => {
                const images = await Promise.all(
                    generatedSprites.map(sprite => {
                        return new Promise<HTMLImageElement>((resolve, reject) => {
                            const img = new Image();
                            img.onload = () => resolve(img);
                            img.onerror = reject;
                            img.crossOrigin = "anonymous"; 
                            img.src = sprite.url;
                        });
                    })
                );
    
                if (images.length === 0 || !images[0]) return;
                
                const canvas = document.createElement('canvas');
                const spriteWidth = images[0].width;
                const spriteHeight = images[0].height;

                if (spriteWidth === 0 || spriteHeight === 0) {
                     console.error("Cannot create sprite sheet from 0-dimension images.");
                     return;
                }
                
                canvas.width = spriteWidth * images.length;
                canvas.height = spriteHeight;
    
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
    
                images.forEach((img, index) => {
                    ctx.drawImage(img, index * spriteWidth, 0, spriteWidth, spriteHeight);
                });
    
                setSpriteSheetUrl(canvas.toDataURL('image/png'));
            };
    
            combineSprites().catch(err => {
                console.error("Failed to combine sprites:", err);
                setError("Could not generate downloadable sprite sheet.");
            });
        } else {
            setSpriteSheetUrl(null);
        }
    }, [generatedSprites]);


    return (
        <div>
            <h2 className="text-2xl font-bold text-sky-300 mb-1">Sprite Sheet Generator</h2>
            <p className="text-slate-400 mb-6">Create animated sprite sheets from a reference character.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">1. Provide Character Reference</label>
                         <div className="flex bg-slate-700/50 rounded-lg p-1 space-x-1 mb-4">
                            <button type="button" onClick={() => setInputMode('upload')} className={`w-full py-2 text-sm rounded-md transition ${inputMode === 'upload' ? 'bg-sky-500 text-white' : 'hover:bg-slate-600/50'}`}>Upload Image</button>
                            <button type="button" onClick={() => setInputMode('text')} className={`w-full py-2 text-sm rounded-md transition ${inputMode === 'text' ? 'bg-sky-500 text-white' : 'hover:bg-slate-600/50'}`}>Use Text Prompt</button>
                        </div>
                        {inputMode === 'upload' ? (
                             <ImageUploader onImageUpload={setReferenceImage} existingImage={referenceImage} />
                        ) : (
                             <div className="space-y-3">
                                <input
                                    type="text"
                                    value={characterName}
                                    onChange={(e) => setCharacterName(e.target.value)}
                                    placeholder="e.g., 'a brave knight with a shiny sword'"
                                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
                                />
                                <Button onClick={handleGenerateRefImage} disabled={isGeneratingRef || !characterName} className="w-full">
                                    {isGeneratingRef ? <Spinner size="sm" /> : <Icon.Sparkles className="w-4 h-4 mr-2"/>}
                                    Generate Reference Image
                                </Button>
                                {referenceImage && (
                                     <div className="mt-2">
                                        <p className="text-sm text-slate-400 mb-2">Generated Reference:</p>
                                        <img src={URL.createObjectURL(referenceImage)} alt="Generated Reference" className="rounded-lg object-contain max-h-40 mx-auto" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                     <div>
                        <label htmlFor="animationPrompt" className="block text-sm font-medium text-slate-300 mb-2">2. Describe Animation</label>
                        <textarea
                            id="animationPrompt"
                            value={animationPrompt}
                            onChange={(e) => setAnimationPrompt(e.target.value)}
                            rows={4}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
                            placeholder="e.g., 'jumping animation', 'attack sequence'"
                        />
                    </div>
                </div>
                
                <div className="text-center">
                    <Button type="submit" disabled={isLoading || !referenceImage} size="lg">
                        {isLoading ? <Spinner /> : <Icon.Wand className="w-5 h-5 mr-2" />}
                        Generate Sprite Sheet
                    </Button>
                </div>
            </form>

            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            
            {generatedSprites.length > 0 && (
                <div className="mt-8">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <h3 className="text-lg font-semibold text-sky-400">Generated Sprite Sheet</h3>
                        {spriteSheetUrl && (
                            <a href={spriteSheetUrl} download="sprite-sheet.png">
                                <Button size="sm">
                                    <Icon.Download className="w-4 h-4 mr-1.5" />
                                    Download Sheet
                                </Button>
                            </a>
                        )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        {generatedSprites.map((sprite) => (
                            <div key={sprite.id} className="aspect-square bg-grid-pattern rounded-md flex items-center justify-center p-2">
                                <img src={sprite.url} alt="Generated Sprite" className="max-w-full max-h-full object-contain" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper for bg-grid-pattern
const style = document.createElement('style');
style.innerHTML = `
.bg-grid-pattern {
    background-image: linear-gradient(to right, rgba(203, 213, 225, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(203, 213, 225, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
}
`;
document.head.appendChild(style);
