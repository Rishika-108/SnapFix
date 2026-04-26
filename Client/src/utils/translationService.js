/**
 * A clean, widget-free translation service using the Google Translate API.
 * This works for dynamic content like user reports, comments, etc.
 */
export const translateText = async (text, targetLang) => {
    if (!text || !targetLang || targetLang === 'en') return text;

    try {
        // Using the Google Translate "gtx" endpoint (free/unofficial)
        // This is the same endpoint used by many open-source translation libs
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Translation failed");
        
        const data = await response.json();
        
        // The Google API returns a complex array structure: [[["translated", "original", ...]]]
        // We extract the translated parts and join them
        const translatedParts = data[0].map(part => part[0]);
        return translatedParts.join("");
    } catch (error) {
        console.error("Translation Error:", error);
        return text; // Fallback to original text on error
    }
};
