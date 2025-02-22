// 🎨 HTML template literal tag function for syntax highlighting and safe HTML rendering
export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
    return strings.reduce((result, str, i) => {
        const value = values[i] || '';
        // Automatically escape any non-string values for safety
        const safeValue = typeof value === 'string' 
            ? escapeHtml(value)
            : String(value);
        return result + str + safeValue;
    }, '');
}

function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}