import { Router } from "../../infrastructure/router.ts";
import { ContactService } from "../../services/contact-service.ts";
import { BaseController } from "../base-controller.ts";
import { ContactHandlers } from "./handlers.ts";
import { setupContactRoutes } from "./routes.ts";

// 👥 Contacts Controller - Handles all contact-related routes
export class ContactsController extends BaseController {
    private contactService: ContactService;
    private contactHandlers: ContactHandlers;

    constructor(router: Router) {
        super(router);
        
        // Initialize services and handlers
        this.contactService = new ContactService();
        this.contactHandlers = new ContactHandlers(this.contactService);
    }

    // 🗺️ Setup all contact-related routes
    protected setupRoutes(): void {
        setupContactRoutes(this.router, this.contactHandlers);
    }
}