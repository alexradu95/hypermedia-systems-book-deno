class Controller {
    private contactsList = ["John Doe", "Jane Doe", "Alice", "Bob", "Michael", "Sarah", "Tom", "Jerry", "Harry", "Ron"];

    private layout(content: string): string {
        return `<!DOCTYPE html>
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

    private contactsTemplate(contacts: string[], query: string): string {
        const contactsList = contacts.length === 0
            ? '<p>No contacts found.</p>'
            : `<ul>
                ${contacts.map(contact => `<li>${this.escapeHtml(contact)}</li>`).join('')}
               </ul>`;

        return `<form method="GET" action="/contacts">
            <div class="grid">
                <input 
                    type="search" 
                    name="q" 
                    placeholder="Search contacts..." 
                    value="${this.escapeHtml(query)}"
                    aria-label="Search">
                <button type="submit">Search</button>
            </div>
        </form>
        <div class="search-results">
            ${contactsList}
        </div>`;
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    async handleRequest(req: Request): Promise<Response> {
        try {
            const url = new URL(req.url);
            const params = url.searchParams;

            if (url.pathname === "/") {
                const redirectUrl = new URL("/contacts", url);
                return Response.redirect(redirectUrl.toString(), 302);
            }

            if (url.pathname === "/contacts") {
                const query = params.get("q") || "";
                const filteredContacts = query
                    ? this.contactsList.filter(contact =>
                        contact.toLowerCase().includes(query.toLowerCase())
                    )
                    : this.contactsList;

                const content = this.contactsTemplate(filteredContacts, query);
                const html = this.layout(content);

                return new Response(html, {
                    status: 200,
                    headers: { "Content-Type": "text/html" }
                });
            }

            return new Response("Not Found", { status: 404 });
        } catch (error) {
            console.error(error);
            return new Response('Error processing request', { status: 500 });
        }
    }
}

// Create instance and start server
const controller = new Controller();
Deno.serve({ port: 3000 }, (req) => controller.handleRequest(req));
