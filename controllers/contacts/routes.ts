import { Router } from "../../infrastructure/router.ts";
import { ContactHandlers } from "./handlers.ts";

// 🗺️ Configure all contact-related routes
export function setupContactRoutes(router: Router, handlers: ContactHandlers): void {
    // 🏠 Root redirect
    router.get("/", handlers.handleRoot);

    // 📋 List contacts
    router.get("/contacts", handlers.listContacts);

    // ✨ New contact form & creation
    router.get("/contacts/new", handlers.newContactForm);
    router.post("/contacts/new", handlers.createContact);

    // 👀 View contact details
    router.get("/contacts/:id", handlers.viewContact);

    // ✏️ Edit contact form & update
    router.get("/contacts/:id/edit", handlers.editContactForm);
    router.post("/contacts/:id/edit", handlers.updateContact);
}
