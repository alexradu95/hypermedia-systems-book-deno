import { Contact } from "../../models/contact.ts";
import { HtmlTemplate } from "../../framework/template/html.ts";

export class ContactsTable {
    static render(contacts: Contact[]): string {
        if (contacts.length === 0) {
            return '<p>No contacts found.</p>';
        }

        const template = new HtmlTemplate(`<table role="grid">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Edit</th>
                    <th>View</th>
                </tr>
            </thead>
            <tbody>
                {{rows}}
            </tbody>
        </table>`);

        return template.render({
            rows: contacts.map(contact => this.renderContactRow(contact)).join('')
        });
    }

    private static renderContactRow(contact: Contact): string {
        const template = new HtmlTemplate(`<tr>
            <td>{{firstName}}</td>
            <td>{{lastName}}</td>
            <td>{{email}}</td>
            <td>{{phone}}</td>
            <td><a href="/contacts/{{id}}/edit" role="button">Edit</a></td>
            <td><a href="/contacts/{{id}}" role="button">View</a></td>
        </tr>`);

        return template.render(contact);
    }
}
