import { Contact } from "../../models/contact.ts";
import { SearchForm } from "../components/search-form.ts";
import { ContactsTable } from "./contacts-table.ts";

export class ContactsView {
    static render(contacts: Contact[], query: string): string {
        return `
            ${SearchForm.render(query)}
            <div class="search-results">
                ${ContactsTable.render(contacts)}
            </div>
            <div>
                <a href="/contacts/new" role="button">Add contact</a>
            </div>`;
    }
}
