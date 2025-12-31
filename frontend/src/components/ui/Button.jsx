import React from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    loading = false,
    className = '',
    ...props
}) {
    return (
        <button
            className={`btn btn-${variant} btn-${size} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <Loader2 className="animate-spin mr-2" size={18} />
            ) : Icon ? (
                <Icon className="btn-icon" size={20} />
            ) : null}
            {children}
        </button>
    );
}
