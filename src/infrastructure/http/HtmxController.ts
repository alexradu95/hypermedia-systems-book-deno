import { CreateNoteUseCase } from "../../application/use-cases/CreateNoteUseCase.ts";
import { GetNotesUseCase } from "../../application/use-cases/GetNotesUseCase.ts";
import { UpdateNoteUseCase } from "../../application/use-cases/UpdateNoteUseCase.ts";
import { layout } from "../templates/layout.ts";
import { noteForm, notesTemplate } from "../templates/notes.ts";
import { ValidationError } from "../../domain/errors/ValidationError.ts";
import { NotFoundError } from "../../domain/errors/NotFoundError.ts";

export class HtmxController {
    constructor(
        private createNote: CreateNoteUseCase,
        private getNotes: GetNotesUseCase,
        private updateNote: UpdateNoteUseCase
    ) {}

    async handleHome(): Promise<Response> {
        const notesDTO = await this.getNotes.execute();
        return new Response(
            layout(notesTemplate(notesDTO)),
            {
                headers: { "Content-Type": "text/html; charset=utf-8" }
            }
        );
    }

    async handleNewNoteForm(): Promise<Response> {
        return new Response(
            noteForm(),
            {
                headers: { "Content-Type": "text/html; charset=utf-8" }
            }
        );
    }

    async handleEditNoteForm(id: string): Promise<Response> {
        try {
            const notesDTO = await this.getNotes.execute();
            const noteDTO = notesDTO.find(n => n.id === id);
            if (!noteDTO) throw new NotFoundError("Note not found");

            return new Response(
                noteForm(noteDTO),
                {
                    headers: { "Content-Type": "text/html; charset=utf-8" }
                }
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    async handleCreateNote(req: Request): Promise<Response> {
        try {
            const formData = await req.formData();
            const noteData = {
                title: formData.get("title") as string,
                content: formData.get("content") as string,
                tags: (formData.get("tags") as string)
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0)
            };

            await this.createNote.execute(noteData);
            const notesDTO = await this.getNotes.execute();

            return new Response(
                notesTemplate(notesDTO),
                {
                    headers: { "Content-Type": "text/html; charset=utf-8" }
                }
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    async handleUpdateNote(req: Request, id: string): Promise<Response> {
        try {
            const formData = await req.formData();
            const noteData = {
                title: formData.get("title") as string,
                content: formData.get("content") as string,
                tags: (formData.get("tags") as string)
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0)
            };

            await this.updateNote.execute(id, noteData);
            const notesDTO = await this.getNotes.execute();

            return new Response(
                notesTemplate(notesDTO),
                {
                    headers: { "Content-Type": "text/html; charset=utf-8" }
                }
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    private handleError(error: unknown): Response {
        const errorHtml = `
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p class="font-bold">Error</p>
                <p>${error instanceof Error ? error.message : 'An unknown error occurred'}</p>
            </div>
        `;

        return new Response(
            errorHtml,
            {
                status: error instanceof ValidationError ? 400 :
                    error instanceof NotFoundError ? 404 : 500,
                headers: { "Content-Type": "text/html; charset=utf-8" }
            }
        );
    }
}
