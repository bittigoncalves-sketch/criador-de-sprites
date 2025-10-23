
import React, { useState, useCallback, useEffect } from 'react';
import { Icon } from '../Icon';

interface ImageUploaderProps {
    onImageUpload: (file: File | null) => void;
    existingImage?: File | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, existingImage }) => {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (existingImage) {
            const objectUrl = URL.createObjectURL(existingImage);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [existingImage]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    const handleRemoveImage = () => {
        onImageUpload(null);
        setPreview(null);
    };

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onImageUpload(file);
        }
    }, [onImageUpload]);

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    if (preview) {
        return (
            <div className="relative">
                <img src={preview} alt="Image preview" className="w-full rounded-lg object-contain max-h-64" />
                <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-slate-900/50 text-white rounded-full p-1.5 hover:bg-red-500/80 transition-colors"
                    aria-label="Remove image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        );
    }
    
    return (
        <div 
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="w-full"
        >
            <label htmlFor="file-upload" className="relative cursor-pointer w-full flex flex-col items-center justify-center p-6 border-2 border-slate-600 border-dashed rounded-lg hover:bg-slate-700/50 transition-colors">
                <Icon.Image className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-sm text-slate-400">
                    <span className="font-semibold text-sky-400">Click to upload</span> or drag and drop
                </span>
                <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
            </label>
        </div>
    );
};
