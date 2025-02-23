import { HtmlTemplate } from "../../framework/template/html.ts";

export class SearchForm {
    static render(query: string): string {
        const template = new HtmlTemplate(`<form method="GET" action="/contacts">
            <div class="grid">
                <input 
                    type="search" 
                    name="q" 
                    placeholder="Search contacts..." 
                    value="{{query}}"
                    aria-label="Search">
                <button type="submit">Search</button>
            </div>
        </form>`);

        return template.render({ query });
    }
}
