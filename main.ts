import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { SQLiteNoteRepository } from "./src/infrastructure/adapters/SQLiteNoteRepository.ts";
import { CreateNoteUseCase } from "./src/application/use-cases/CreateNoteUseCase.ts";
import { GetNotesUseCase } from "./src/application/use-cases/GetNotesUseCase.ts";
import { UpdateNoteUseCase } from "./src/application/use-cases/UpdateNoteUseCase.ts";
import { HtmxController } from "./src/infrastructure/http/HtmxController.ts";
import { initializeDatabase } from "./db/init.ts";
import { Router } from "./src/infrastructure/http/Router.ts";

const db = new DB("notes.db");
initializeDatabase();

const noteRepository = new SQLiteNoteRepository(db);
const createNote = new CreateNoteUseCase(noteRepository);
const getNotes = new GetNotesUseCase(noteRepository);
const updateNote = new UpdateNoteUseCase(noteRepository);
const htmxController = new HtmxController(createNote, getNotes, updateNote);
const router = new Router(htmxController);

const ac = new AbortController();

Deno.serve({
  port: 3000,
  hostname: "127.0.0.1",
  signal: ac.signal,
  handler: (req: Request) => router.handle(req)
});

// For cleaner shutdown
globalThis.addEventListener("unload", () => {
  ac.abort();
  db.close();
});
