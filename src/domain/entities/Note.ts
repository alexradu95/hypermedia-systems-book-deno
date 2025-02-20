import { ValidationError } from "../errors/ValidationError.ts";

export interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export class NoteEntity implements Note {
    id: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        public title: string,
        public content: string,
        public tags: string[] = []
    ) {
        this.id = crypto.randomUUID();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    validate(): void {
        if (!this.title.trim()) throw new ValidationError('Title is required');
        if (!this.content.trim()) throw new ValidationError('Content is required');
    }

    update(title: string, content: string, tags: string[]) {
        this.title = title;
        this.content = content;
        this.tags = tags;
        this.updatedAt = new Date();
        this.validate();
    }
}

