// 🚀 Super Simple Router - Because life's too short for complexity!

// 🎯 Types that make TypeScript happy
type RouteHandler = (req: Request, params: Record<string, string>) => Promise<Response> | Response;
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

// 📝 Route Definition - The GPS for your HTTP requests
interface Route {
  pattern: URLPattern;   // 🎯 Modern URL pattern matching
  method: HttpMethod;    // 📡 What kind of HTTP request we're dealing with
  handler: RouteHandler; // 🎮 The function that does all the magic
}

// 🎮 The Router Class - Your HTTP traffic controller
export class Router {
  // 📦 Private stash of routes by method for faster lookups
  #routesByMethod = new Map<HttpMethod, Route[]>();

  // 🏭 Method factory for all HTTP methods
  #createMethodHandler(method: HttpMethod) {
    return (path: string, handler: RouteHandler) => {
      this.#addRoute(method, path, handler);
      return this;
    };
  }

  // Initialize HTTP method handlers
  get = this.#createMethodHandler("GET");
  post = this.#createMethodHandler("POST");
  put = this.#createMethodHandler("PUT");
  patch = this.#createMethodHandler("PATCH");
  delete = this.#createMethodHandler("DELETE");
  head = this.#createMethodHandler("HEAD");
  options = this.#createMethodHandler("OPTIONS");

  // 🔧 Private helper to add routes to our collection
  #addRoute(method: HttpMethod, path: string, handler: RouteHandler) {
    const pattern = new URLPattern({ pathname: path });
    const route = { pattern, method, handler };
    
    if (!this.#routesByMethod.has(method)) {
      this.#routesByMethod.set(method, []);
    }
    this.#routesByMethod.get(method)?.push(route);
  }

  // 🎮 The main event - handle incoming requests like a pro
  async handle(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method as HttpMethod;

    // 🤔 OPTIONS request? Let's handle it automatically
    if (method === "OPTIONS") {
      return this.#handleOptions(url.pathname);
    }

    // 🔍 Get routes for this method
    const routes = this.#routesByMethod.get(method) ?? [];
    
    // 🎯 Find matching route
    for (const route of routes) {
      const result = route.pattern.exec(url);
      if (result?.pathname.groups) {
        // Ensure all parameter values are strings, filter out undefined
        const params = Object.fromEntries(
          Object.entries(result.pathname.groups)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        );
        return await route.handler(req, params);
      }
    }

    // 😢 No route found? 404 it is!
    return new Response("Not Found", { status: 404 });
  }

  // 🤝 Handle OPTIONS requests - CORS's best friend
  #handleOptions(pathname: string): Response {
    const allowedMethods = Array.from(this.#routesByMethod.entries())
      .filter(([_, routes]) => 
        routes.some(route => route.pattern.test({ pathname }))
      )
      .map(([method]) => method);

    if (allowedMethods.length === 0) {
      return new Response(null, { status: 404 });
    }

    return new Response(null, {
      status: 204,
      headers: {
        "Allow": allowedMethods.join(", "),
        "Access-Control-Allow-Methods": allowedMethods.join(", ")
      }
    });
  }
}
