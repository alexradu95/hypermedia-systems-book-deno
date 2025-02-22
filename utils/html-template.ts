// 🎨 HTML template literal tag function for syntax highlighting and safe HTML rendering
export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
    return strings.reduce((result, str, i) => {
        if (i >= values.length) return result + str;
        
        const value = values[i];
        // Don't escape if it's already an HTML string (from another html`` call)
        if (typeof value === 'string' && value.includes('<') && value.includes('>')) {
            return result + str + value;
        }
        // Escape other values for safety
        return result + str + escapeValue(value);
    }, '');
}

function escapeValue(value: unknown): string {
    if (value === null || value === undefined) return '';
    const str = String(value);
    return escapeHtml(str);
}

function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}