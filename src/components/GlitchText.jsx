import React from 'react';
import { motion } from 'framer-motion';
import './GlitchText.css';

const GlitchText = ({ text, as: Component = 'h1', className = '' }) => {
    return (
        <div className={`glitch-wrapper ${className}`}>
            <Component className="glitch" data-text={text}>
                {text}
            </Component>
        </div>
    );
};

export default GlitchText;
