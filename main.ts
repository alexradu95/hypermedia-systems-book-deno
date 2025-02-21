import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { serve } from "https://deno.land/std/http/server.ts";

// ============= Domain Types =============
interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

// ============= Database Layer =============
class NoteRepository {
    constructor(private db: DB) {
        this.initializeDatabase();
    }

    private initializeDatabase() {
        this.db.execute(`
            CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                tags TEXT NOT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL
            )
        `);
    }

    async findAll(): Promise<Note[]> {
        const results = this.db.queryEntries<any>("SELECT * FROM notes");
        return results.map(this.mapToNote);
    }

    async findById(id: string): Promise<Note | null> {
        const result = this.db.queryEntries<any>(
            "SELECT * FROM notes WHERE id = ?",
            [id]
        );
        return result[0] ? this.mapToNote(result[0]) : null;
    }

    async save(note: Note): Promise<Note> {
        this.db.query(
            `INSERT OR REPLACE INTO notes (id, title, content, tags, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                note.id,
                note.title,
                note.content,
                JSON.stringify(note.tags),
                note.createdAt.toISOString(),
                note.updatedAt.toISOString()
            ]
        );
        return note;
    }

    private mapToNote(row: any): Note {
        return {
            id: row.id,
            title: row.title,
            content: row.content,
            tags: JSON.parse(row.tags),
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
        };
    }
}

// ============= Hypermedia Resources =============
interface Link {
    rel: string;
    href: string;
    title?: string;
    action?: string;
}

interface HypermediaResponse {
    toHtml(): string;
    toHal(): string;
    toHyperview(): string;
}

class NoteResource implements HypermediaResponse {
    constructor(private note: Note) {}

    toHtml(): string {
        return `
            <div class="note" data-id="${this.note.id}">
                <h2 class="text-xl font-bold">${this.note.title}</h2>
                <p class="mt-2">${this.note.content}</p>
                <div class="flex gap-2 mt-2">
                    ${this.note.tags.map(tag => `
                        <a href="/tags/${encodeURIComponent(tag)}" 
                           class="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            ${tag}
                        </a>
                    `).join('')}
                </div>
                <div class="mt-4 space-x-2">
                    <button hx-get="/notes/${this.note.id}/edit"
                            hx-target="#main"
                            class="bg-blue-500 text-white px-4 py-2 rounded">
                        Edit
                    </button>
                    <button hx-delete="/notes/${this.note.id}"
                            hx-target="#main"
                            class="bg-red-500 text-white px-4 py-2 rounded">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    toHal(): string {
        return JSON.stringify({
            _links: {
                self: { href: `/notes/${this.note.id}` },
                collection: { href: '/notes' },
                edit: { href: `/notes/${this.note.id}/edit` }
            },
            _embedded: {
                tags: this.note.tags.map(tag => ({
                    _links: { self: { href: `/tags/${tag}` } },
                    name: tag
                }))
            },
            ...this.note
        });
    }

    toHyperview(): string {
        return `
            <doc xmlns="https://hyperview.org/hyperview">
                <screen>
                    <body>
                        <view style="padding: 16">
                            <text style="font-size: 24; font-weight: bold">
                                ${this.note.title}
                            </text>
                            <text style="margin-top: 8">
                                ${this.note.content}
                            </text>
                            <view style="flex-direction: row; margin-top: 8">
                                ${this.note.tags.map(tag => `
                                    <behavior trigger="press" href="/tags/${tag}">
                                        <text style="margin: 4; color: blue">${tag}</text>
                                    </behavior>
                                `).join('')}
                            </view>
                        </view>
                    </body>
                </screen>
            </doc>
        `;
    }
}

class NoteFormResource implements HypermediaResponse {
    constructor(private note?: Note) {}

    toHtml(): string {
        return `
            <form hx-${this.note ? 'put' : 'post'}="${this.note ? `/notes/${this.note.id}` : '/notes'}"
                  hx-target="#main"
                  class="space-y-4 max-w-lg mx-auto">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" 
                           name="title" 
                           value="${this.note?.title || ''}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Content</label>
                    <textarea name="content"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                              rows="4">${this.note?.content || ''}</textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Tags</label>
                    <input type="text" 
                           name="tags" 
                           value="${this.note?.tags.join(', ') || ''}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                </div>
                <div class="flex justify-end space-x-2">
                    <button type="submit"
                            class="bg-blue-500 text-white px-4 py-2 rounded">
                        ${this.note ? 'Update' : 'Create'} Note
                    </button>
                </div>
            </form>
        `;
    }

    toHal(): string {
        return JSON.stringify({
            _links: {
                self: { href: this.note ? `/notes/${this.note.id}/edit` : '/notes/new' },
                submit: { 
                    href: this.note ? `/notes/${this.note.id}` : '/notes',
                    method: this.note ? 'PUT' : 'POST'
                }
            },
            ...this.note
        });
    }

    toHyperview(): string {
        return `
            <doc xmlns="https://hyperview.org/hyperview">
                <screen>
                    <form>
                        <!-- Form fields would go here -->
                    </form>
                </screen>
            </doc>
        `;
    }
}

// ============= Application Controller =============
class HypermediaController {
    constructor(private repository: NoteRepository) {}

    async handleRequest(req: Request): Promise<Response> {
        try {
            const url = new URL(req.url);
            const contentType = this.negotiateContentType(req);
            const resource = await this.routeRequest(req);
            
            return new Response(
                this.renderResource(resource, contentType),
                {
                    headers: {
                        'Content-Type': contentType,
                        'Vary': 'Accept'
                    }
                }
            );
        } catch (error) {
            console.error(error);
            return new Response('Error processing request', { status: 500 });
        }
    }

    private negotiateContentType(req: Request): string {
        const accept = req.headers.get('Accept');
        if (!accept) return 'text/html';

        if (accept.includes('application/hal+json')) return 'application/hal+json';
        if (accept.includes('application/hyperview+xml')) return 'application/hyperview+xml';
        return 'text/html';
    }

    private renderResource(resource: HypermediaResponse, contentType: string): string {
        switch (contentType) {
            case 'application/hal+json':
                return resource.toHal();
            case 'application/hyperview+xml':
                return resource.toHyperview();
            default:
                return this.wrapHtml(resource.toHtml());
        }
    }

    private wrapHtml(content: string): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Notes App</title>
                <script src="https://unpkg.com/htmx.org@1.9.10"></script>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-gray-100 min-h-screen">
                <div class="container mx-auto p-4">
                    <div id="main">
                        ${content}
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    private async routeRequest(req: Request): Promise<HypermediaResponse> {
        const url = new URL(req.url);
        const method = req.method;

        // Route matching
        const routes = {
            'GET /notes': () => this.handleGetNotes(),
            'GET /notes/new': () => this.handleNewNoteForm(),
            'POST /notes': (req: Request) => this.handleCreateNote(req),
            'GET /notes/:id': (id: string) => this.handleGetNote(id),
            'GET /notes/:id/edit': (id: string) => this.handleEditNoteForm(id),
            'PUT /notes/:id': (id: string, req: Request) => this.handleUpdateNote(id, req),
            'DELETE /notes/:id': (id: string) => this.handleDeleteNote(id)
        };

        // Find matching route
        for (const [pattern, handler] of Object.entries(routes)) {
            const [routeMethod, routePath] = pattern.split(' ');
            if (method === routeMethod) {
                const match = this.matchRoute(routePath, url.pathname);
                if (match) {
                    return handler(...match.slice(1), req);
                }
            }
        }

        throw new Error('Not Found');
    }

    private matchRoute(pattern: string, path: string): string[] | null {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');

        if (patternParts.length !== pathParts.length) return null;

        const params: string[] = ['matched'];
        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                params.push(pathParts[i]);
            } else if (patternParts[i] !== pathParts[i]) {
                return null;
            }
        }

        return params;
    }

    // Handler methods
    private async handleGetNotes(): Promise<HypermediaResponse> {
        const notes = await this.repository.findAll();
        // Return collection resource
        return {
            toHtml: () => `
                <div>
                    <div class="mb-4">
                        <button hx-get="/notes/new"
                                hx-target="#main"
                                class="bg-green-500 text-white px-4 py-2 rounded">
                            New Note
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${notes.map(note => new NoteResource(note).toHtml()).join('')}
                    </div>
                </div>
            `,
            toHal: () => JSON.stringify({
                _links: {
                    self: { href: '/notes' },
                    create: { href: '/notes/new' }
                },
                _embedded: {
                    notes: notes.map(note => JSON.parse(new NoteResource(note).toHal()))
                }
            }),
            toHyperview: () => `
                <doc xmlns="https://hyperview.org/hyperview">
                    <screen>
                        <body>
                            <view style="padding: 16">
                                ${notes.map(note => `
                                    <view style="margin-bottom: 16">
                                        ${new NoteResource(note).toHyperview()}
                                    </view>
                                `).join('')}
                            </view>
                        </body>
                    </screen>
                </doc>
            `
        };
    }

    private async handleGetNote(id: string): Promise<HypermediaResponse> {
        const note = await this.repository.findById(id);
        if (!note) throw new Error('Note not found');
        return new NoteResource(note);
    }

    private handleNewNoteForm(): HypermediaResponse {
        return new NoteFormResource();
    }

    private async handleEditNoteForm(id: string): Promise<HypermediaResponse> {
        const note = await this.repository.findById(id);
        if (!note) throw new Error('Note not found');
        return new NoteFormResource(note);
    }

    private async handleCreateNote(req: Request): Promise<HypermediaResponse> {
        const formData = await req.formData();
        const note: Note = {
            id: crypto.randomUUID(),
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await this.repository.save(note);
        return this.handleGetNotes();
    }

    private async handleUpdateNote(id: string, req: Request): Promise<HypermediaResponse> {
        const formData = await req.formData();
        const existingNote = await this.repository.findById(id);
        if (!existingNote) throw new Error('Note not found');

        const updatedNote: Note = {
            ...existingNote,
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
            updatedAt: new Date()
        };
        
        await this.repository.save(updatedNote);
        return this.handleGetNotes();
    }

    private async handleDeleteNote(id: string): Promise<HypermediaResponse> {
        const note = await this.repository.findById(id);
        if (!note) throw new Error('Note not found');
        // Add delete method to repository if needed
        return this.handleGetNotes();
    }
}

// ============= Main Application =============
const db = new DB("notes.db");
const repository = new NoteRepository(db);
const controller = new HypermediaController(repository);

// Start the server
serve(req => controller.handleRequest(req), { port: 3000 });

// Cleanup on exit
addEventListener("unload", () => {
    db.close();
});