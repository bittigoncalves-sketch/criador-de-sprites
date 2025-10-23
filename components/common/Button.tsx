
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className,
    size = 'md',
    ...props
}) => {
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const baseClasses =
        'inline-flex items-center justify-center font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const themeClasses = 'bg-sky-500 text-white hover:bg-sky-600';

    return (
        <button
            className={`${baseClasses} ${themeClasses} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
