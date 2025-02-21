import { HtmlUtils } from "../utils/html-utils.ts";

export class SearchForm {
    static render(query: string): string {
        return `<form method="GET" action="/contacts">
            <div class="grid">
                <input 
                    type="search" 
                    name="q" 
                    placeholder="Search contacts..." 
                    value="${HtmlUtils.escapeHtml(query)}"
                    aria-label="Search">
                <button type="submit">Search</button>
            </div>
        </form>`;
    }
}
