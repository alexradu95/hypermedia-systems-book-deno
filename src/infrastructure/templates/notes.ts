import { NoteDTO } from "../../application/dtos/NoteDTO.ts";

export const notesTemplate = (notes: NoteDTO[]) => `
    <div class="mb-6">
        <button 
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            hx-get="/notes/new"
            hx-target="#form-area"
            hx-swap="innerHTML">
            + New Note
        </button>
    </div>

    <div id="form-area"></div>

    <div id="notes-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${notes.map(noteCard).join("")}
    </div>
`;

export const noteCard = (note: NoteDTO) => `
    <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-2">${note.title}</h2>
        <p class="text-gray-600 mb-4 whitespace-pre-wrap">${note.content}</p>
        <div class="flex flex-wrap gap-2 mb-4">
            ${note.tags.map(tag => `
                <span class="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                    ${tag}
                </span>
            `).join("")}
        </div>
        <div class="flex justify-between items-center text-sm">
            <span class="text-gray-500">
                ${new Date(note.createdAt).toLocaleDateString()}
            </span>
            <button
                class="text-blue-500 hover:text-blue-700"
                hx-get="/notes/${note.id}/edit"
                hx-target="#form-area"
                hx-swap="innerHTML">
                Edit
            </button>
        </div>
    </div>
`;

export const noteForm = (note?: NoteDTO) => `
    <form 
        id="note-form" 
        class="bg-white rounded-lg shadow p-6 mb-6"
        hx-${note ? 'put' : 'post'}="/notes${note ? `/${note.id}` : ''}"
        hx-target="#notes-list"
        hx-swap="outerHTML">
        
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
                Title
            </label>
            <input 
                type="text"
                id="title"
                name="title"
                value="${note?.title || ''}"
                class="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                required
            >
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="content">
                Content
            </label>
            <textarea
                id="content"
                name="content"
                class="w-full p-2 border rounded focus:outline-none focus:border-blue-500 h-32"
                required
            >${note?.content || ''}</textarea>
        </div>

        <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="tags">
                Tags (comma-separated)
            </label>
            <input
                type="text"
                id="tags"
                name="tags"
                value="${note?.tags.join(', ') || ''}"
                class="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            >
        </div>

        <div class="flex justify-end gap-2">
            <button
                type="button"
                class="px-4 py-2 text-gray-600 hover:text-gray-800"
                hx-get="/notes"
                hx-target="#form-area"
                hx-swap="innerHTML">
                Cancel
            </button>
            <button
                type="submit"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                ${note ? 'Update' : 'Create'} Note
            </button>
        </div>
    </form>
`;
