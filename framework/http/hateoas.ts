// 🌐 HATEOAS Router - Making your API navigate itself!
import { Router } from "./router.ts";

// 🔗 Link Definition - The GPS coordinates for your API
interface Link {
  href: string;    // 🌍 Where this link takes you
  rel: string;     // 👥 The relationship to the current resource
  method: string;  // 🎯 What HTTP method to use
  title?: string;  // 📝 Optional description of what this link does
}

// 📦 Resource Definition - Your data + its navigation manual
interface Resource<T> {
  data: T;         // 📄 The actual content
  links: Link[];   // 🧭 Navigation links - where can I go from here?
}

// 🚀 HateoasRouter - Your API's GPS system
export class HateoasRouter {
  // 🎮 Composition - We're using the basic router under the hood
  constructor(private router: Router) {}

  // 🎁 Wrap your data in a HATEOAS-friendly package
  static createResource<T>(data: T, links: Link[]): Resource<T> {
    return { data, links }; // 🎨 Simple but powerful
  }

  // 🔨 Create a standardized link - because consistency is key
  static createLink(href: string, rel: string, method = "GET", title?: string): Link {
    return { href, rel, method, title }; // 🎯 One-stop shop for link creation
  }

  // 📬 Send a HATEOAS response - with all the right headers
  static jsonResponse<T>(resource: Resource<T>, status = 200): Response {
    return new Response(JSON.stringify(resource, null, 2), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // 🌍 CORS-friendly!
      }
    });
  }

  // 🎯 Delegate HTTP methods to our basic router
  // But keep it chainable! 🔄

  get(path: string, handler: (req: Request, params: Record<string, string>) => Promise<Response> | Response) {
    return this.router.get(path, handler); // 📥 GET requests
  }

  post(path: string, handler: (req: Request, params: Record<string, string>) => Promise<Response> | Response) {
    return this.router.post(path, handler); // 📤 POST requests
  }

  put(path: string, handler: (req: Request, params: Record<string, string>) => Promise<Response> | Response) {
    return this.router.put(path, handler); // 🔄 PUT requests
  }

  patch(path: string, handler: (req: Request, params: Record<string, string>) => Promise<Response> | Response) {
    return this.router.patch(path, handler); // 🩹 PATCH requests
  }

  delete(path: string, handler: (req: Request, params: Record<string, string>) => Promise<Response> | Response) {
    return this.router.delete(path, handler); // 🗑️ DELETE requests
  }

  // 🎮 The main event - handle those requests!
  handle(req: Request): Promise<Response> {
    return this.router.handle(req); // 🎯 Let the basic router do its thing
  }
}
