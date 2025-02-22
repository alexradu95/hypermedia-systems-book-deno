// 🎮 The function that handles your routes like a boss!
// Takes a request, some params, returns a Response (sync or async, we don't judge)
// Supports HTMX headers and partial responses for that sweet, sweet hypermedia goodness!
type RouteHandler = (req: Request, params: Record<string, string>) => Promise<Response> | Response;

// 🚀 HTTP Methods - All the verbs you need for a proper HATEOAS party!
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// 🎭 HTMX-specific headers for that extra spice
interface HtmxHeaders {
    "HX-Request"?: string;
    "HX-Trigger"?: string;
    "HX-Trigger-Name"?: string;
    "HX-Target"?: string;
    "HX-Current-URL"?: string;
}

// 🗺️ The blueprint for our route - like a GPS for your web requests
interface Route {
    pattern: RegExp;     // 🎯 RegExp sniper that matches URLs
    methods: HttpMethod[];   // 📝 What HTTP methods we're willing to dance with
    handler: RouteHandler; // 🎮 The function that does the actual work
}

// 🎨 Response options with HTMX superpowers
interface HtmxResponseInit extends ResponseInit {
    headers?: HeadersInit & HtmxHeaders;
}

// 🚀 The Router - Your personal web traffic controller
export class Router {
    // 📦 Storage for all our routes - like a fancy address book
    private routes: Route[] = [];

    // 🎣 Handle GET requests - for when you just want to fetch stuff
    get(path: string, handler: RouteHandler) {
        this.addRoute(path, ["GET"], handler);
        return this; // 🔄 Chain these bad boys!
    }

    // 📮 Handle POST requests - when you need to send some data to the server
    post(path: string, handler: RouteHandler) {
        this.addRoute(path, ["POST"], handler);
        return this; // 🔄 Chainable like your favorite crypto currency
    }

    // 🔄 Handle PUT requests - full resource updates
    put(path: string, handler: RouteHandler) {
        this.addRoute(path, ["PUT"], handler);
        return this;
    }

    // 🩹 Handle PATCH requests - partial updates for the win
    patch(path: string, handler: RouteHandler) {
        this.addRoute(path, ["PATCH"], handler);
        return this;
    }

    // 🗑️ Handle DELETE requests - when it's time to say goodbye
    delete(path: string, handler: RouteHandler) {
        this.addRoute(path, ["DELETE"], handler);
        return this;
    }

    // 🎭 Handle both GET and POST - for routes that swing both ways
    any(path: string, handler: RouteHandler) {
        this.addRoute(path, ["GET", "POST"], handler);
        return this; // 🔄 Chain chain chain
    }

    // 🧙‍♂️ The magical route adding function - where the real magic happens
    private addRoute(path: string, methods: HttpMethod[], handler: RouteHandler) {
        // 🪄 Transform URL path into RegExp - pure magic!
        const pattern = new RegExp(
            "^" + 
            path.replace(/\//g, "\\/")  // 🔒 Escape those slashes like they're your ex
                .replace(/:(\w+)/g, "(?<$1>[^/]+)")  // ✨ Turn :id into named capture groups
            + "$"
        );
        this.routes.push({ pattern, methods, handler });
    }

    // 🔍 Check if this is an HTMX request
    private isHtmxRequest(req: Request): boolean {
        return req.headers.get("HX-Request") === "true";
    }

    // 🎯 The main event - handle incoming requests like a pro
    async handle(req: Request): Promise<Response> {
        const url = new URL(req.url);
        const method = req.method as HttpMethod;
        const isHtmx = this.isHtmxRequest(req);

        // 🔍 Search through our routes like we're looking for matching socks
        for (const route of this.routes) {
            const match = url.pathname.match(route.pattern);
            if (match && route.methods.includes(method)) {
                // 🎉 We found a winner! Extract params from the URL
                const params: Record<string, string> = {};
                if (match.groups) {
                    // 🎁 Unwrap those URL parameters like Christmas presents
                    for (const [key, value] of Object.entries(match.groups)) {
                        params[key] = value;
                    }
                }

                // 🎨 Handle the response with style
                const response = await route.handler(req, params);

                // 🎭 If it's an HTMX request, we might want to return partial content
                if (isHtmx) {
                    // Make sure we're sending HTML content type for HTMX
                    const headers = new Headers(response.headers);
                    headers.set("Content-Type", "text/html; charset=utf-8");
                    
                    // Copy the response with new headers
                    return new Response(response.body, {
                        status: response.status,
                        headers
                    });
                }

                return response;
            }
        }

        // 😢 No route found? Return 404 like a responsible adult
        return new Response("Not Found", { status: 404 });
    }

    // 🏗️ Helper to create HTMX-friendly responses
    static htmxResponse(
        content: string,
        options: HtmxResponseInit = {}
    ): Response {
        const headers = new Headers(options.headers);
        headers.set("Content-Type", "text/html; charset=utf-8");
        
        return new Response(content, {
            ...options,
            headers
        });
    }
}
