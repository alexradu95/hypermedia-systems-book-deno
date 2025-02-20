// src/infrastructure/http/NoteController.ts (Modified - Centralized Error Handling)
import { CreateNoteUseCase } from "../../application/use-cases/CreateNoteUseCase.ts";
import { GetNotesUseCase } from "../../application/use-cases/GetNotesUseCase.ts";
import { UpdateNoteUseCase } from "../../application/use-cases/UpdateNoteUseCase.ts";
import { CreateNoteDTO } from "../../application/dtos/CreateNoteDTO.ts";
import { UpdateNoteDTO } from "../../application/dtos/UpdateNoteDTO.ts";
import { ValidationError } from "../../domain/errors/ValidationError.ts";
import { NotFoundError } from "../../domain/errors/NotFoundError.ts";

export class NoteController {
    constructor(
        private createNote: CreateNoteUseCase,
        private getNotes: GetNotesUseCase,
        private updateNote: UpdateNoteUseCase
    ) {}

    async handleCreateNote(req: Request): Promise<Response> {
        try {
            const createNoteDTO: CreateNoteDTO = await req.json();
            const noteDTO = await this.createNote.execute(createNoteDTO);
            return this.successResponse(noteDTO, 201);
        } catch (error: unknown) {
            return this.errorResponse(error);
        }
    }

    async handleGetNotes(req: Request): Promise<Response> {
        try {
            const notesDTO = await this.getNotes.execute();
            return this.successResponse(notesDTO);
        } catch (error: unknown) {
            return this.errorResponse(error);
        }
    }

    async handleUpdateNote(req: Request, id: string): Promise<Response> {
        try {
            const updateNoteDTO: UpdateNoteDTO = await req.json();
            const noteDTO = await this.updateNote.execute(id, updateNoteDTO);
            return this.successResponse(noteDTO);
        } catch (error: unknown) {
            return this.errorResponse(error);
        }
    }

    private successResponse(data: any, status: number = 200): Response {
        return new Response(JSON.stringify(data), {
            status: status,
            headers: { "Content-Type": "application/json" },
        });
    }

    private errorResponse(error: unknown): Response {
        if (error instanceof ValidationError) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (error instanceof NotFoundError) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        // Handle other custom errors (e.g., DatabaseError)

        // Default to 500 for unhandled errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
