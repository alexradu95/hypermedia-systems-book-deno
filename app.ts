import { Router } from "./router.ts";
import { ContactsController } from "./controllers/contacts-controller.ts";

// Create router and controllers
const router = new Router();
new ContactsController(router);

// Start server
Deno.serve({ port: 3000 }, async (req) => {
    try {
        return await router.handle(req);
    } catch (error) {
        console.error("Error handling request:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
});