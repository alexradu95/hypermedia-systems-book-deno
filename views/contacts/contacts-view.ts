import { Contact } from "../../models/contact.ts";
import { HtmlTemplate } from "../../framework/template/html.ts";
import { SearchForm } from "../components/search-form.ts";
import { ContactsTable } from "./contacts-table.ts";

export class ContactsView {
    static render(contacts: Contact[], query: string): string {
        const template = new HtmlTemplate(`
            {{search_form}}
            <div class="search-results">
                {{contacts_table}}
            </div>
            <div>
                <a href="/contacts/new" role="button">Add contact</a>
            </div>`);

        return template.render({
            search_form: SearchForm.render(query),
            contacts_table: ContactsTable.render(contacts)
        });
    }
}
