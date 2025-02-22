import { Router } from "../router.ts";
import { ContactService } from "../services/contact-service.ts";
import { BaseController } from "./base-controller.ts";
import { ContactHandlers } from "./contacts/handlers.ts";
import { setupContactRoutes } from "./contacts/routes.ts";

// 👥 Contacts Controller - Handles all contact-related routes
export class ContactsController extends BaseController {
    private contactService: ContactService;
    private contactHandlers: ContactHandlers;

    constructor(router: Router) {
        // Initialize services and handlers before calling super
        const contactService = new ContactService();
        const contactHandlers = new ContactHandlers(contactService);
        
        // Call super after initialization
        super(router);
        
        // Assign to instance properties
        this.contactService = contactService;
        this.contactHandlers = contactHandlers;
    }

    // 🗺️ Setup all contact-related routes
    protected setupRoutes(): void {
        setupContactRoutes(this.router, this.contactHandlers);
    }
}