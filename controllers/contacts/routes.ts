import { Router } from "../../router.ts";
import { ContactHandlers } from "./handlers.ts";

// 🗺️ Configure all contact-related routes
export function setupContactRoutes(router: Router, handlers: ContactHandlers): void {
    // 🏠 Root redirect
    router.get("/", handlers.handleRoot.bind(handlers));

    // 📋 List contacts
    router.get("/contacts", handlers.listContacts.bind(handlers));

    // ✨ New contact form & creation
    router.get("/contacts/new", handlers.newContactForm.bind(handlers));
    router.post("/contacts/new", handlers.createContact.bind(handlers));

    // 👀 View contact details
    router.get("/contacts/:id", handlers.viewContact.bind(handlers));

    // ✏️ Edit contact form & update
    router.get("/contacts/:id/edit", handlers.editContactForm.bind(handlers));
    router.post("/contacts/:id/edit", handlers.updateContact.bind(handlers));
}
