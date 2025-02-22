import { html } from "../../utils/html-template.ts";

export class BaseLayout {
    static render(content: string): string {
        return html`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Search</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
            <style>
                body > header {
                    padding: 2rem 0;
                    background: var(--card-background-color);
                    margin-bottom: 2rem;
                }
                body > footer {
                    text-align: center;
                    padding: 1rem 0;
                    margin-top: 2rem;
                    background: var(--card-background-color);
                }
                .container {
                    padding: 0 1rem;
                }
                .search-results {
                    margin-top: 2rem;
                }
            </style>
        </head>
        <body>
            <header>
                <div class="container">
                    <h1>Contact Search</h1>
                </div>
            </header>

            <main class="container">
                ${content}
            </main>

            <footer>
                <div class="container">
                    <p>&copy; 2025 Contact Search App</p>
                </div>
            </footer>
        </body>
        </html>`;
    }
}
