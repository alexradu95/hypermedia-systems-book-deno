import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import {Note} from "../../domain/entities/Note.ts";
import { NoteRepository } from "../../domain/ports/NoteRepository.ts";

export class SQLiteNoteRepository implements NoteRepository {
    constructor(private db: DB) {}

    async save(note: Note): Promise<Note> {
        this.db.query(
          "INSERT INTO notes (id, title, content, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
          [
            note.id,
            note.title,
            note.content,
            JSON.stringify(note.tags),
            note.createdAt.toISOString(),
            note.updatedAt.toISOString()
          ]
        );
        return note;
    }

    async findById(id: string): Promise<Note | null> {
        const result = this.db.query<[string, string, string, string, string, string]>(
            "SELECT id, title, content, tags, created_at, updated_at FROM notes WHERE id = ?",
            [id]
        );

        if (!result.length) return null;

        const [noteId, title, content, tags, createdAt, updatedAt] = result[0];
        return {
            id: noteId,
            title,
            content,
            tags: JSON.parse(tags),
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt)
        };
    }

    async findAll(): Promise<Note[]> {
        const results = this.db.query<[string, string, string, string, string, string]>(
            "SELECT id, title, content, tags, created_at, updated_at FROM notes"
        );

        return results.map(([id, title, content, tags, createdAt, updatedAt]) => ({
            id,
            title,
            content,
            tags: JSON.parse(tags),
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt)
        }));
    }

    async update(note: Note): Promise<Note> {
        this.db.query(
            "UPDATE notes SET title = ?, content = ?, tags = ?, updated_at = ? WHERE id = ?",
            [
                note.title,
                note.content,
                JSON.stringify(note.tags),
                note.updatedAt.toISOString(),
                note.id
            ]
        );
        return note;
    }

    async delete(id: string): Promise<void> {
        this.db.query("DELETE FROM notes WHERE id = ?", [id]);
    }

    async findByTag(tag: string): Promise<Note[]> {
        const allNotes = await this.findAll();
        return allNotes.filter(note => note.tags.includes(tag));
    }
}
