export interface NoteDTO {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string; // Or Date, but be consistent
    updatedAt: string; // Or Date
}
