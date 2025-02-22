import { Contact } from "../../models/contact.ts";
import { html } from "../../utils/html-template.ts";

export class ContactsTable {
    static render(contacts: Contact[]): string {
        if (contacts.length === 0) {
            return '<p>No contacts found.</p>';
        }

        return html`<table role="grid">
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
                ${contacts.map(contact => this.renderContactRow(contact)).join('')}
            </tbody>
        </table>`;
    }

    private static renderContactRow(contact: Contact): string {
        return html`<tr>
            <td>${contact.firstName}</td>
            <td>${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td><a href="/contacts/${contact.id}/edit" role="button">Edit</a></td>
            <td><a href="/contacts/${contact.id}" role="button">View</a></td>
        </tr>`;
    }
}
