interface Contact {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

class Controller {
    private contactsList: Contact[] = [
        { id: 1, firstName: "John", lastName: "Doe", email: "john.doe@example.com", phone: "+1234567890" },
        { id: 2, firstName: "Jane", lastName: "Doe", email: "jane.doe@example.com", phone: "+1234567891" },
        { id: 3, firstName: "Alice", lastName: "Smith", email: "alice.smith@example.com", phone: "+1234567892" },
        { id: 4, firstName: "Bob", lastName: "Johnson", email: "bob.johnson@example.com", phone: "+1234567893" },
        { id: 5, firstName: "Michael", lastName: "Brown", email: "michael.brown@example.com", phone: "+1234567894" },
        { id: 6, firstName: "Sarah", lastName: "Lee", email: "sarah.lee@example.com", phone: "+1234567895" },
        { id: 7, firstName: "Tom", lastName: "Davis", email: "tom.davis@example.com", phone: "+1234567896" },
        { id: 8, firstName: "Jerry", lastName: "Miller", email: "jerry.miller@example.com", phone: "+1234567897" },
        { id: 9, firstName: "Harry", lastName: "Wilson", email: "harry.wilson@example.com", phone: "+1234567898" },
        { id: 10, firstName: "Ron", lastName: "Anderson", email: "ron.anderson@example.com", phone: "+1234567899" }
    ];

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

    private contactsTemplate(contacts: Contact[], query: string): string {
        const contactsList = contacts.length === 0
            ? '<p>No contacts found.</p>'
            : `<table role="grid">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Edit</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    ${contacts.map(contact => `
                        <tr>
                            <td>${this.escapeHtml(contact.firstName)}</td>
                            <td>${this.escapeHtml(contact.lastName)}</td>
                            <td>${this.escapeHtml(contact.email)}</td>
                            <td>${this.escapeHtml(contact.phone)}</td>
                            <td><a href="/contacts/${contact.id}/edit">Edit</td>
                            <td><a href="/contacts/${contact.id}/">View</td>
                        </tr>
                    `).join('')}
                </tbody>
               </table>`;
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
                        contact.firstName.toLowerCase().includes(query.toLowerCase()) ||
                        contact.lastName.toLowerCase().includes(query.toLowerCase()) ||
                        contact.email.toLowerCase().includes(query.toLowerCase()) ||
                        contact.phone.includes(query)
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
