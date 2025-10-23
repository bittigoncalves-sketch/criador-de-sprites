
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-10 h-10 border-4',
    };

    return (
        <div
            className={`${sizeClasses[size]} animate-spin rounded-full border-solid border-sky-400 border-t-transparent`}
            role="status"
            aria-live="polite"
            aria-label="Loading"
        ></div>
    );
};
