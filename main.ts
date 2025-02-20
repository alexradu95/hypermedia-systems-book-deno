import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { SQLiteNoteRepository } from "./src/infrastructure/adapters/SQLiteNoteRepository.ts";
import {CreateNoteUseCase } from "./src/application/use-cases/CreateNoteUseCase.ts";
import { NoteController } from "./src/infrastructure/http/NoteController.ts";
import {GetNotesUseCase} from "./src/application/use-cases/GetNotesUseCase.ts";
import { UpdateNoteUseCase } from "./src/application/use-cases/UpdateNoteUseCase.ts";
import { initializeDatabase } from "./db/init.ts"; // Import


const dbFilename = Deno.env.get("DB_FILENAME") || "notes.db"; // Get from environment, default to "notes.db"
const port = Number(Deno.env.get("PORT") || 3000); // Get port, default to 3000

const db = new DB(dbFilename);
initializeDatabase();

const noteRepository = new SQLiteNoteRepository(db);
const createNote = new CreateNoteUseCase(noteRepository);
const getNotes = new GetNotesUseCase(noteRepository);
const updateNote = new UpdateNoteUseCase(noteRepository);
const noteController = new NoteController(createNote, getNotes, updateNote);

const ac = new AbortController();



Deno.serve({
  port: port,
  hostname: "127.0.0.1",
  signal: ac.signal,
  onListen({ port, hostname }) {
    console.log(`Notes API server started at http://${hostname}:${port}`);
  },
  handler: async (req: Request) => {
    const url = new URL(req.url);

    if (url.pathname === "/api/notes") {
      switch (req.method) {
        case "POST":
          return noteController.handleCreateNote(req);
        case "GET":
          return noteController.handleGetNotes(req);
      }
    }

    if (url.pathname.startsWith("/api/notes/")) {
      const id = url.pathname.split("/")[3];
      if (req.method === "PUT") {
        return noteController.handleUpdateNote(req, id);
      }
    }

    return new Response("Not Found", { status: 404 });
  }
});

// To properly handle server shutdown
globalThis.addEventListener("unload", () => {
  ac.abort();
});
