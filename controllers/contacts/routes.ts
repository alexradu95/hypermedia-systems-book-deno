import { Router } from "../../framework/http/router.ts";
import { ContactHandlers } from "./handlers.ts";

// 🗺️ Configure all contact-related routes
export function setupContactRoutes(router: Router, handlers: ContactHandlers): void {
    // Group routes by their purpose for better organization
    
    // 🏠 Root and listing
    router
        .get("/", handlers.handleRoot)
        .get("/contacts", handlers.listContacts);

    // ✨ Contact creation
    router
        .get("/contacts/new", handlers.newContactForm)
        .post("/contacts/new", handlers.createContact);

    // 👀 Contact viewing and editing
    router
        .get("/contacts/:id", handlers.viewContact)
        .get("/contacts/:id/edit", handlers.editContactForm)
        .post("/contacts/:id/edit", handlers.updateContact);
}
