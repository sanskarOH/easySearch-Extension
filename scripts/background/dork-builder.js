const MAX_LEN = 400;

export function sanitizeInput(str, maxLen = MAX_LEN) {
    if(!str) return '';
    return String(str)
        .replace(/[\r\n]+/g,'')
        .replace(/[<>]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLen)

}


export function generateDork(options = {}){
    const {query = '' , filetype = '' , exact = false} = options;
    const sanitizedQuery = sanitizeInput(query);
    if (!sanitizedQuery){
        console.error("Error with sanitizaton");
        return '';
        
    }

    const parts = [];
    const main = exact && /\s/.test(sanitizedQuery) ? `"${sanitizedQuery}"`: sanitizedQuery;
    parts.push(main);

    if (filetype && /^[a-z0-9]+$/i.test(filetype)) parts.push(`filetype:${filetype}`);
    if (site && /^[\w\.-]+(\.[a-z]{2,})?$/.test(site)) parts.push(`site:${site}`);
    if (inTitle) parts.push(`intitle:${wrapIfNeeded(inTitle)}`);
    if (inUrl) parts.push(`inurl:${wrapIfNeeded(inUrl)}`);
    (exclude || []).forEach(w => {
        const cleaned = sanitizeInput(w, 60);
        if (cleaned) parts.push(`-${cleaned}`);
    });

    return parts.join(' ').slice(0, DEFAULT_MAX_LEN);

}