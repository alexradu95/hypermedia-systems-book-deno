import { Note } from "../../domain/entities/Note.ts";
import { NoteRepository } from "../../domain/ports/NoteRepository.ts";
import { NoteDTO } from "../dtos/NoteDTO.ts";
import { NoteMapper } from "../mappers/NoteMapper.ts";
export class GetNotesUseCase {
    private noteMapper: NoteMapper;
    constructor(private noteRepository: NoteRepository) {
        this.noteMapper = new NoteMapper();
    }

    async execute(): Promise<NoteDTO[]> {
        const notes = await this.noteRepository.findAll();
        return notes.map(this.noteMapper.toDTO); // Use the mapper in a concise way
    }
}
