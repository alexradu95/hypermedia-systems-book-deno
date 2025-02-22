import { Router } from "../router.ts";
import { ContactService } from "../services/contact-service.ts";
import { BaseController } from "./base-controller.ts";
import { ContactHandlers } from "./contacts/handlers.ts";
import { setupContactRoutes } from "./contacts/routes.ts";

// 👥 Contacts Controller - Handles all contact-related routes
export class ContactsController extends BaseController {
    private contactService: ContactService;
    private contactHandlers: ContactHandlers;  // 👈 More specific name!

    constructor(router: Router) {
        super(router);
        this.contactService = new ContactService();
        this.contactHandlers = new ContactHandlers(this.contactService);
    }

    // 🗺️ Setup all contact-related routes
    protected setupRoutes(): void {
        setupContactRoutes(this.router, this.contactHandlers);
    }
}