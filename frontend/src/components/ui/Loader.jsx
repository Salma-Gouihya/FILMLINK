import React from 'react';
import './Loader.css';

export default function Loader({ size = 'md', className = '' }) {
    return (
        <div className={`film-loader loader-${size} ${className}`}>
            <div className="reel"></div>
            <div className="reel-inner"></div>
        </div>
    );
}
