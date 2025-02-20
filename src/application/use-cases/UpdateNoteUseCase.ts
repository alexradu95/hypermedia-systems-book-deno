import { NoteRepository } from "../../domain/ports/NoteRepository.ts";
import { NoteEntity, Note } from "../../domain/entities/Note.ts";
import { NoteDTO } from "../dtos/NoteDTO.ts";
import { UpdateNoteDTO } from "../dtos/UpdateNoteDTO.ts";
import { NoteMapper } from "../mappers/NoteMapper.ts";
import { NotFoundError } from "../../domain/errors/NotFoundError.ts";
export class UpdateNoteUseCase {
    private noteMapper: NoteMapper;
    constructor(private noteRepository: NoteRepository) {
        this.noteMapper = new NoteMapper();
    }

    async execute(id: string, dto: UpdateNoteDTO): Promise<NoteDTO> {
        const existingNote = await this.noteRepository.findById(id);
        if (!existingNote) {
            throw new NotFoundError("Note not found"); // Use custom error
        }

        const updatedNote = new NoteEntity(dto.title, dto.content, dto.tags);
        updatedNote.id = existingNote.id;
        updatedNote.createdAt = existingNote.createdAt;
        updatedNote.validate()
        const savedNote = await this.noteRepository.update(updatedNote);
        return this.noteMapper.toDTO(savedNote); // Use the mapper
    }
}
