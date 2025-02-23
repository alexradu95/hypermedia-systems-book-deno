import { ContactService } from "../../services/contact-service.ts";
import { BaseLayout } from "../../views/layouts/base-layout.ts";
import { ContactsView } from "../../views/contacts/contacts-view.ts";
import { ContactForm } from "../../views/contacts/contact-form.ts";
import { ContactDetails } from "../../views/contacts/contact-details.ts";
import { HtmlTemplate } from "../../framework/template/html.ts";

// 🎮 Handlers for all contact-related routes
export class ContactHandlers {
    #contactService: ContactService;

    constructor(contactService: ContactService) {
        this.#contactService = contactService;
    }

    // 🏠 Root handler
    handleRoot = (req: Request): Response => {
        const url = new URL(req.url);
        return Response.redirect(new URL("/contacts", url).toString(), 302);
    };

    // 📋 List contacts handler
    listContacts = async (req: Request): Promise<Response> => {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") ?? "";
        const filteredContacts = this.#contactService.searchContacts(query);
        
        const content = ContactsView.render(filteredContacts, query);
        return new Response(BaseLayout.render(content), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    };

    // ✨ New contact form handler
    newContactForm = (_req: Request): Response => {
        const content = ContactForm.render();
        return new Response(BaseLayout.render(content), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    };

    // 📝 Create contact handler
    createContact = async (req: Request): Promise<Response> => {
        const formData = await req.formData();
        const newContact = {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string
        };
        
        this.#contactService.createContact(newContact);
        const url = new URL(req.url);
        return Response.redirect(new URL("/contacts", url).toString(), 302);
    };

    // 👀 View contact handler
    viewContact = (req: Request, params: Record<string, string>): Response => {
        const contactId = Number(params.id);
        if (Number.isNaN(contactId)) {
            return new Response("Invalid contact ID", { status: 400 });
        }
        
        const contact = this.#contactService.getContact(contactId);
        if (!contact) {
            return new Response("Contact not found", { status: 404 });
        }
        
        const content = ContactDetails.render(contact);
        return new Response(BaseLayout.render(content), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    };

    // ✏️ Edit contact form handler
    editContactForm = (req: Request, params: Record<string, string>): Response => {
        const contactId = Number(params.id);
        if (Number.isNaN(contactId)) {
            return new Response("Invalid contact ID", { status: 400 });
        }
        
        const contact = this.#contactService.getContact(contactId);
        if (!contact) {
            return new Response("Contact not found", { status: 404 });
        }
        
        const content = ContactForm.render(contact);
        return new Response(BaseLayout.render(content), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    };

    // 💾 Update contact handler
    updateContact = async (req: Request, params: Record<string, string>): Promise<Response> => {
        const contactId = Number(params.id);
        if (Number.isNaN(contactId)) {
            return new Response("Invalid contact ID", { status: 400 });
        }
        
        const formData = await req.formData();
        const updatedContact = {
            id: contactId,
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string
        };
        
        const success = this.#contactService.updateContact(updatedContact.id, updatedContact);
        if (!success) {
            return new Response("Contact not found", { status: 404 });
        }
        
        const url = new URL(req.url);
        return Response.redirect(new URL(`/contacts/${contactId}`, url).toString(), 302);
    };
}
