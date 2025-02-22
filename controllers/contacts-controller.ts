import { BaseController } from "./base-controller.ts";
import { Router } from "../router.ts";
import { ContactService } from "../services/contact-service.ts";
import { BaseLayout } from "../views/layouts/base-layout.ts";
import { ContactsView } from "../views/contacts/contacts-view.ts";
import { ContactForm } from "../views/contacts/contact-form.ts";
import { ContactDetails } from "../views/contacts/contact-details.ts";

// 👥 Contacts Controller - Handles all contact-related routes
export class ContactsController extends BaseController {
    private contactService: ContactService;

    constructor(router: Router) {
        super(router);
        this.contactService = new ContactService();
    }

    // 🗺️ Setup all contact-related routes
    protected setupRoutes(): void {
        // 🏠 Redirect root to contacts
        this.router.get("/", (req) => {
            const url = new URL(req.url);
            const redirectUrl = new URL("/contacts", url);
            return Response.redirect(redirectUrl.toString(), 302);
        });

        // 📋 List contacts
        this.router.get("/contacts", this.listContacts.bind(this));

        // ✨ New contact form & creation
        this.router.get("/contacts/new", this.newContactForm.bind(this));
        this.router.post("/contacts/new", this.createContact.bind(this));

        // 👀 View contact details
        this.router.get("/contacts/:id", this.viewContact.bind(this));

        // ✏️ Edit contact form & update
        this.router.get("/contacts/:id/edit", this.editContactForm.bind(this));
        this.router.post("/contacts/:id/edit", this.updateContact.bind(this));
    }

    // 📋 List all contacts with optional search
    private async listContacts(req: Request): Promise<Response> {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const filteredContacts = this.contactService.searchContacts(query);
        const content = ContactsView.render(filteredContacts, query);
        return new Response(BaseLayout.render(content), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    }

    // 📝 Show new contact form
    private newContactForm(): Response {
        const content = ContactForm.render();
        return new Response(BaseLayout.render(content), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    }

    // ✨ Create new contact
    private async createContact(req: Request): Promise<Response> {
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
    }

    // 👀 View single contact
    private viewContact(_req: Request, params: Record<string, string>): Response {
        const contactId = parseInt(params.id);
        const contact = this.contactService.getContact(contactId);
        
        if (!contact) {
            return new Response("Contact not found", { status: 404 });
        }

        const content = ContactDetails.render(contact);
        return new Response(BaseLayout.render(content), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    }

    // ✏️ Show edit contact form
    private editContactForm(_req: Request, params: Record<string, string>): Response {
        const contactId = parseInt(params.id);
        const contact = this.contactService.getContact(contactId);
        
        if (!contact) {
            return new Response("Contact not found", { status: 404 });
        }

        const content = ContactForm.render(contact);
        return new Response(BaseLayout.render(content), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    }

    // 💾 Update existing contact
    private async updateContact(req: Request, params: Record<string, string>): Promise<Response> {
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
    }
}
