import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("notes.db"); // Or get this from config

export function initializeDatabase() {
    db.execute(`
        CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            tags TEXT NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL
        )
    `);
    db.close();
}
