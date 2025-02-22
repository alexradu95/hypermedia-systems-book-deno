import { html } from "../../utils/html-template.ts";

export class SearchForm {
    static render(query: string): string {
        return html`<form method="GET" action="/contacts">
            <div class="grid">
                <input 
                    type="search" 
                    name="q" 
                    placeholder="Search contacts..." 
                    value="${query}"
                    aria-label="Search">
                <button type="submit">Search</button>
            </div>
        </form>`;
    }
}
