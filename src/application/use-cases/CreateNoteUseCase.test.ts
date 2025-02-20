// src/application/use-cases/CreateNoteUseCase.test.ts (Example Unit Test)
import { CreateNoteUseCase } from "./CreateNoteUseCase.ts";
import { NoteRepository } from "../../domain/ports/NoteRepository.ts";
import { Note } from "../../domain/entities/Note.ts";
import { assertEquals, assertThrows } from "@std/assert";
import { NoteMapper } from "../mappers/NoteMapper.ts";
import { CreateNoteDTO } from "../dtos/CreateNoteDTO.ts";
import { ValidationError } from "../../domain/errors/ValidationError.ts";

// Mock the NoteRepository
class MockNoteRepository implements NoteRepository {
    save(note: Note): Promise<Note> {
        return Promise.resolve(note);
    }
    async findById(id: string): Promise<Note | null> {return null}
    async findAll(): Promise<Note[]> {return []}
    async update(note: Note): Promise<Note>{return note}
    async delete(id: string): Promise<void> {}
    async findByTag(tag: string): Promise<Note[]> {return []}
}

Deno.test("CreateNoteUseCase should create a note", async () => {
    const mockRepo = new MockNoteRepository();
    const createNoteUseCase = new CreateNoteUseCase(mockRepo);
    const dto: CreateNoteDTO = { title: "Test Title", content: "Test Content", tags: ["test"] };
    const noteDTO = await createNoteUseCase.execute(dto);

    assertEquals(noteDTO.title, "Test Title");
    assertEquals(noteDTO.content, "Test Content");
    assertEquals(noteDTO.tags, ["test"]);
    assertEquals(typeof noteDTO.id, "string"); // Check that ID is generated
});

Deno.test("CreateNoteUseCase should throw ValidationError if title is empty", async () => {
    const mockRepo = new MockNoteRepository();
    const createNoteUseCase = new CreateNoteUseCase(mockRepo);
    const dto: CreateNoteDTO = { title: "", content: "Test Content", tags: [] };
    assertThrows(
      () => createNoteUseCase.execute(dto),
      ValidationError,
      "Title is required"
    );
});
