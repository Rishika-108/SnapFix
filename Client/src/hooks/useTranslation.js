import { useAuth } from "../context/AuthContext";
import { translations } from "../utils/translations";
import { translateText } from "../utils/translationService";
import { useState, useEffect, useCallback, useRef } from "react";

// Global cache to persist translations across component renders
const translationCache = {};

export const useTranslation = () => {
    const { language } = useAuth();
    const [translatedStrings, setTranslatedStrings] = useState({});
    const pendingTranslations = useRef(new Set());

    /**
     * The Smart Translation Function (Option 1)
     * Handles: t('navbar.home') AND t('Welcome back, citizen!')
     */
    const t = useCallback((input) => {
        if (!input) return "";

        // 1. Try to resolve as a key in translations.js
        const keys = input.split('.');
        let resolved = translations['en'];
        for (const k of keys) {
            resolved = resolved ? resolved[k] : null;
        }

        // The English version of the text (either resolved from key or the input itself)
        const englishText = typeof resolved === 'string' ? resolved : input;

        // If user wants English, return the English text immediately
        if (language === 'en') return englishText;

        // 2. Check Cache/State for translated version
        const cacheKey = `${language}:${englishText}`;
        if (translationCache[cacheKey]) return translationCache[cacheKey];
        if (translatedStrings[cacheKey]) return translatedStrings[cacheKey];

        // 3. Queue for translation if not already pending
        if (!pendingTranslations.current.has(englishText)) {
            pendingTranslations.current.add(englishText);
        }

        // Return English while translating
        return englishText;
    }, [language, translatedStrings]);

    // Background Translation Worker
    useEffect(() => {
        if (language === 'en' || pendingTranslations.current.size === 0) return;

        const processQueue = async () => {
            const queue = Array.from(pendingTranslations.current);
            pendingTranslations.current.clear(); // Clear to prevent loops

            const newTranslations = {};
            await Promise.all(queue.map(async (text) => {
                const translated = await translateText(text, language);
                const cacheKey = `${language}:${text}`;
                translationCache[cacheKey] = translated;
                newTranslations[cacheKey] = translated;
            }));

            // Trigger re-render with new translations
            setTranslatedStrings(prev => ({ ...prev, ...newTranslations }));
        };

        processQueue();
    }, [language, translatedStrings]); // Watch translatedStrings to catch items added during render

    /**
     * Manual translate function for dynamic content
     */
    const translateContent = useCallback(async (text) => {
        if (!text || language === 'en') return text;
        const cacheKey = `${language}:${text}`;
        if (translationCache[cacheKey]) return translationCache[cacheKey];
        const translated = await translateText(text, language);
        translationCache[cacheKey] = translated;
        return translated;
    }, [language]);

    return { t, language, translateContent };
};
