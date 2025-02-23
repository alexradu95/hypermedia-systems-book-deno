import { ContactsController } from "./controllers/contacts/controller.ts";
import { Router } from "./framework/http/router.ts";

// Create router and controllers
const router = new Router();
const contactsController = new ContactsController(router);
contactsController.init();

// Start server
Deno.serve({ port: 3000 }, async (req) => {
    try {
        return await router.handle(req);
    } catch (error) {
        console.error("Error handling request:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
});