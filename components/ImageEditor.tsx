
import React, { useState } from 'react';
import { editImageWithPrompt } from '../services/geminiService';
import { ImageUploader } from './common/ImageUploader';
import { Spinner } from './common/Spinner';
import { Button } from './common/Button';
import { Icon } from './Icon';

export const ImageEditor: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('');
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile || !prompt) {
            setError('Please upload an image and provide an editing prompt.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const resultUrl = await editImageWithPrompt(imageFile, prompt);
            setEditedImage(resultUrl);
        } catch (err) {
            console.error(err);
            setError('Failed to edit image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-sky-300 mb-1">AI Image Editor</h2>
            <p className="text-slate-400 mb-6">Transform your images with simple text commands.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">1. Upload Image</label>
                        <ImageUploader onImageUpload={setImageFile} existingImage={imageFile} />
                    </div>
                     <div>
                        <label htmlFor="editPrompt" className="block text-sm font-medium text-slate-300 mb-2">2. Describe Your Edit</label>
                        <textarea
                            id="editPrompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
                            placeholder="e.g., 'Add a retro filter', 'Remove the person in the background', 'Make it look like a watercolor painting'"
                        />
                    </div>
                </div>
                
                <div className="text-center">
                    <Button type="submit" disabled={isLoading || !imageFile || !prompt} size="lg">
                        {isLoading ? <Spinner /> : <Icon.Wand className="w-5 h-5 mr-2" />}
                        Apply Edit
                    </Button>
                </div>
            </form>

            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            
            {editedImage && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-sky-400 mb-4 text-center">Edited Image</h3>
                    <div className="flex flex-col items-center gap-4">
                         <img src={editedImage} alt="Edited result" className="rounded-lg max-w-full md:max-w-md max-h-[50vh] object-contain shadow-lg" />
                         <a href={editedImage} download="edited-image.png">
                            <Button>
                                <Icon.Download className="w-5 h-5 mr-2" />
                                Download Image
                            </Button>
                         </a>
                    </div>
                </div>
            )}
        </div>
    );
};
