// src/infrastructure/http/Router.ts
import { HtmxController } from "./HtmxController.ts";

export class Router {
    constructor(private htmxController: HtmxController) {}

    async handle(req: Request): Promise<Response> {
        const url = new URL(req.url);

        // Handle CORS preflight
        if (req.method === "OPTIONS") {
            return this.handleCORS();
        }

        try {
            return await this.route(req, url);
        } catch (error) {
            console.error('Router error:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    }

    private async route(req: Request, url: URL): Promise<Response> {
        // Main routes
        if (this.isRootPath(url.pathname)) {
            return this.handleRootRoutes(req);
        }

        // Form routes
        if (this.isNewNoteForm(url.pathname)) {
            return this.htmxController.handleNewNoteForm();
        }

        // Note operations
        const noteIdMatch = this.getNoteIdMatch(url.pathname);
        if (noteIdMatch) {
            return this.handleNoteOperations(req, noteIdMatch);
        }

        return new Response("Not Found", { status: 404 });
    }

    private isRootPath(pathname: string): boolean {
        return pathname === "/" || pathname === "/notes";
    }

    private isNewNoteForm(pathname: string): boolean {
        return pathname === "/notes/new";
    }

    private getNoteIdMatch(pathname: string): RegExpMatchArray | null {
        return pathname.match(/^\/notes\/([^/]+)(\/edit)?$/);
    }

    private async handleRootRoutes(req: Request): Promise<Response> {
        switch (req.method) {
            case "GET":
                return this.htmxController.handleHome();
            case "POST":
                return this.htmxController.handleCreateNote(req);
            default:
                return new Response("Method Not Allowed", { status: 405 });
        }
    }

    private async handleNoteOperations(
        req: Request,
        noteIdMatch: RegExpMatchArray
    ): Promise<Response> {
        const id = noteIdMatch[1];

        if (noteIdMatch[2] === "/edit") {
            return this.htmxController.handleEditNoteForm(id);
        }

        if (req.method === "PUT") {
            return this.htmxController.handleUpdateNote(req, id);
        }

        return new Response("Method Not Allowed", { status: 405 });
    }

    private handleCORS(): Response {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });
    }
}
