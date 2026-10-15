import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    padded?: boolean;
}

const Card = ({ children, padded = true, className = '', ...rest }: CardProps) => {
    const padding = padded ? 'p-4 sm:p-6' : '';
    return (
        <div
            className={`bg-white rounded-xl border border-gray-200 shadow-sm ${padding} ${className}`}
            {...rest}
        >
            {children}
        </div>
    );
};

export default Card;
