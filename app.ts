import { Contact } from "./models/contact.ts";
import { ContactService } from "./services/contact-service.ts";
import { BaseLayout } from "./views/layouts/base-layout.ts";
import { ContactsView } from "./views/contacts/contacts-view.ts";
import { ContactForm } from "./views/contacts/contact-form.ts";

class ContactController {
    private contactService: ContactService;

    constructor() {
        this.contactService = new ContactService();
    }

    async handleRequest(req: Request): Promise<Response> {
        try {
            const url = new URL(req.url);
            const params = url.searchParams;

            if (url.pathname === "/") {
                const redirectUrl = new URL("/contacts", url);
                return Response.redirect(redirectUrl.toString(), 302);
            }

            if (url.pathname === "/contacts/new") {
                if (req.method === "GET") {
                    const content = ContactForm.render();
                    return new Response(BaseLayout.render(content), {
                        headers: { "Content-Type": "text/html; charset=utf-8" }
                    });
                } else if (req.method === "POST") {
                    const formData = await req.formData();
                    const newContact = {
                        firstName: formData.get("firstName") as string,
                        lastName: formData.get("lastName") as string,
                        email: formData.get("email") as string,
                        phone: formData.get("phone") as string
                    };
                    
                    this.contactService.createContact(newContact);
                    const redirectUrl = new URL("/contacts", url);
                    return Response.redirect(redirectUrl.toString(), 302);
                }
            }

            if (url.pathname === "/contacts") {
                const query = params.get("q") || "";
                const filteredContacts = this.contactService.searchContacts(query);
                const content = ContactsView.render(filteredContacts, query);
                return new Response(BaseLayout.render(content), {
                    headers: { "Content-Type": "text/html; charset=utf-8" }
                });
            }

            // Return 404 for unhandled routes
            return new Response("Not Found", { status: 404 });
        } catch (error) {
            console.error("Error handling request:", error);
            return new Response("Internal Server Error", { status: 500 });
        }
    }
}

// Create instance and start server
const controller = new ContactController();
Deno.serve({ port: 3000 }, (req) => controller.handleRequest(req));
