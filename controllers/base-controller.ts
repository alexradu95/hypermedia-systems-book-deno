import { Router } from "../router.ts";

// 🎮 Base Controller - The template for all your feature controllers
export abstract class BaseController {
    protected router: Router;

    constructor(router: Router) {
        this.router = router;
        this.setupRoutes();
    }

    // 🎯 Each feature controller must implement this
    protected abstract setupRoutes(): void;
}
