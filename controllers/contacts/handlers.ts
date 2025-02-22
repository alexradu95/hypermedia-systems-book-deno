import { ContactService } from "../../services/contact-service.ts";
import { BaseLayout } from "../../views/layouts/base-layout.ts";
import { ContactsView } from "../../views/contacts/contacts-view.ts";
import { ContactForm } from "../../views/contacts/contact-form.ts";
import { ContactDetails } from "../../views/contacts/contact-details.ts";

// 🎮 Handlers for all contact-related routes
export class ContactHandlers {
    // Define handlers as instance properties with arrow functions
    public handleRoot = (req: Request): Response => {
        const url = new URL(req.url);
        const redirectUrl = new URL("/contacts", url);
        return Response.redirect(redirectUrl.toString(), 302);
    };

    public listContacts = async (req: Request): Promise<Response> => {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        const filteredContacts = this.contactService.searchContacts(query);
        const content = ContactsView.render(filteredContacts, query);
        return new Response(BaseLayout.render(content), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    };

    public newContactForm = (_req: Request): Response => {
        const content = ContactForm.render();
        return new Response(BaseLayout.render(content), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    };

    public createContact = async (req: Request): Promise<Response> => {
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
    };

    public viewContact = (_req: Request, params: Record<string, string>): Response => {
        const contactId = parseInt(params.id);
        const contact = this.contactService.getContact(contactId);
        
        if (!contact) {
            return new Response("Contact not found", { status: 404 });
        }

        const content = ContactDetails.render(contact);
        return new Response(BaseLayout.render(content), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    };

    public editContactForm = (_req: Request, params: Record<string, string>): Response => {
        const contactId = parseInt(params.id);
        const contact = this.contactService.getContact(contactId);
        
        if (!contact) {
            return new Response("Contact not found", { status: 404 });
        }

        const content = ContactForm.render(contact);
        return new Response(BaseLayout.render(content), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    };

    public updateContact = async (req: Request, params: Record<string, string>): Promise<Response> => {
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
    };

    constructor(private contactService: ContactService) {}
}
