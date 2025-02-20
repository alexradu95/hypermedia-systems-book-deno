
import { Note } from "../../domain/entities/Note.ts";
import { NoteDTO } from "../dtos/NoteDTO.ts";

export class NoteMapper {
    toDTO(note: Note): NoteDTO {
        return {
            id: note.id,
            title: note.title,
            content: note.content,
            tags: note.tags,
            createdAt: note.createdAt.toISOString(),
            updatedAt: note.updatedAt.toISOString(),
        };
    }

    toEntity(noteDTO: NoteDTO): Note {
        throw new Error("Method not implemented"); // You may not always need the reverse conversion
    }
}
