import { Contact } from "./models/contact.ts";
import { ContactService } from "./services/contact-service.ts";
import { BaseLayout } from "./views/layouts/base-layout.ts";
import { ContactsView } from "./views/contacts/contacts-view.ts";
import { ContactForm } from "./views/contacts/contact-form.ts";
import { ContactDetails } from "./views/contacts/contact-details.ts";
import { Router } from "./router.ts";

class ContactController {
    private contactService: ContactService;
    private router: Router;

    constructor() {
        this.contactService = new ContactService();
        this.router = new Router();
        this.setupRoutes();
    }

    private setupRoutes() {
        // Redirect root to contacts
        this.router.get("/", (req) => {
            const url = new URL(req.url);
            const redirectUrl = new URL("/contacts", url);
            return Response.redirect(redirectUrl.toString(), 302);
        });

        // List contacts
        this.router.get("/contacts", (req) => {
            const url = new URL(req.url);
            const query = url.searchParams.get("q") || "";
            const filteredContacts = this.contactService.searchContacts(query);
            const content = ContactsView.render(filteredContacts, query);
            return new Response(BaseLayout.render(content), {
                headers: { "Content-Type": "text/html; charset=utf-8" }
            });
        });

        // New contact form
        this.router.get("/contacts/new", (_req) => {
            const content = ContactForm.render();
            return new Response(BaseLayout.render(content), {
                headers: { "Content-Type": "text/html; charset=utf-8" }
            });
        });

        // Create new contact
        this.router.post("/contacts/new", async (req) => {
            const formData = await req.formData();
            const newContact = {
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string
            };
            
            this.contactService.createContact(newContact);
            const url = new URL(req.url);
            const redirectUrl = new URL("/contacts", url);
            return Response.redirect(redirectUrl.toString(), 302);
        });

        // View contact details
        this.router.get("/contacts/:id", (_req, params) => {
            const contactId = parseInt(params.id);
            const contact = this.contactService.getContact(contactId);
            
            if (!contact) {
                return new Response("Contact not found", { status: 404 });
            }

            const content = ContactDetails.render(contact);
            return new Response(BaseLayout.render(content), {
                headers: { "Content-Type": "text/html; charset=utf-8" }
            });
        });

        // Edit contact form
        this.router.get("/contacts/:id/edit", (_req, params) => {
            const contactId = parseInt(params.id);
            const contact = this.contactService.getContact(contactId);
            
            if (!contact) {
                return new Response("Contact not found", { status: 404 });
            }

            const content = ContactForm.render(contact);
            return new Response(BaseLayout.render(content), {
                headers: { "Content-Type": "text/html; charset=utf-8" }
            });
        });

        // Update contact
        this.router.post("/contacts/:id/edit", async (req, params) => {
            const contactId = parseInt(params.id);
            const contact = this.contactService.getContact(contactId);
            
            if (!contact) {
                return new Response("Contact not found", { status: 404 });
            }

            const formData = await req.formData();
            const updatedContact = {
                ...contact,
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string
            };
            
            this.contactService.updateContact(contactId, updatedContact);
            const url = new URL(req.url);
            const redirectUrl = new URL(`/contacts/${contactId}`, url);
            return Response.redirect(redirectUrl.toString(), 302);
        });
    }

    async handleRequest(req: Request): Promise<Response> {
        try {
            return await this.router.handle(req);
        } catch (error) {
            console.error("Error handling request:", error);
            return new Response("Internal Server Error", { status: 500 });
        }
    }
}

// Create instance and start server
const controller = new ContactController();
Deno.serve({ port: 3000 }, (req) => controller.handleRequest(req));
