import { Note, NoteEntity } from "../../domain/entities/Note.ts";
import { NoteRepository } from "../../domain/ports/NoteRepository.ts";
import { CreateNoteDTO } from "../dtos/CreateNoteDTO.ts";
import { NoteDTO } from "../dtos/NoteDTO.ts";
import { NoteMapper } from "../mappers/NoteMapper.ts"; // Import the mapper

export class CreateNoteUseCase {
    private noteMapper: NoteMapper;
    constructor(private noteRepository: NoteRepository) {
        this.noteMapper = new NoteMapper();
    }

    async execute(dto: CreateNoteDTO): Promise<NoteDTO> {
        const note = new NoteEntity(dto.title, dto.content, dto.tags);
        note.validate();
        const savedNote = await this.noteRepository.save(note);
        return this.noteMapper.toDTO(savedNote); // Use the mapper
    }
}
