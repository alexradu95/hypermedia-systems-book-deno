import { Router } from "../framework/http/router.ts";

// 🎮 Base Controller - The template for all your feature controllers
export abstract class BaseController {
    // Use private field with # for better encapsulation
    #router: Router;

    constructor(router: Router) {
        this.#router = router;
    }

    // 🚀 Initialize the controller
    init(): void {
        this.setupRoutes();
    }

    // 🎯 Each feature controller must implement this
    protected abstract setupRoutes(): void;

    // 🛡️ Protected getter for the router
    protected get router(): Router {
        return this.#router;
    }
}
