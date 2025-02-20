import { HtmxController } from "./HtmxController.ts";

// src/infrastructure/http/routes.ts
type Route = {
    pattern: RegExp;
    methods: {
        [key: string]: (req: Request, params: string[]) => Promise<Response>;
    };
};

export const defineRoutes = (controller: HtmxController): Route[] => [
    {
        pattern: /^\/$/,
        methods: {
            GET: (req) => controller.handleHome()
        }
    },
    {
        pattern: /^\/notes\/?$/,
        methods: {
            GET: (req) => controller.handleHome(),
            POST: (req) => controller.handleCreateNote(req)
        }
    },
    {
        pattern: /^\/notes\/new$/,
        methods: {
            GET: (req) => controller.handleNewNoteForm()
        }
    },
    {
        pattern: /^\/notes\/([^/]+)\/edit$/,
        methods: {
            GET: (req, [id]) => controller.handleEditNoteForm(id)
        }
    },
    {
        pattern: /^\/notes\/([^/]+)$/,
        methods: {
            PUT: (req, [id]) => controller.handleUpdateNote(req, id)
        }
    }
];
