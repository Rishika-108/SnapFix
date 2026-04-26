import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * A powerful component that automatically translates any text passed as children.
 * Perfect for long educational content or static labels without manual translation keys.
 */
const TranslatedText = ({ children, className = "" }) => {
    const { language, translateContent } = useTranslation();
    const [displayText, setDisplayText] = useState(children);

    useEffect(() => {
        const performTranslation = async () => {
            if (!children) return;
            
            if (language === 'en') {
                setDisplayText(children);
            } else {
                const translated = await translateContent(children);
                setDisplayText(translated);
            }
        };
        performTranslation();
    }, [language, children, translateContent]);

    return <span className={className}>{displayText}</span>;
};

export default TranslatedText;
