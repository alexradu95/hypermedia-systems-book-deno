import { Contact } from "../../models/contact.ts";
import { HtmlUtils } from "../utils/html-utils.ts";

export class ContactsTable {
    static render(contacts: Contact[]): string {
        if (contacts.length === 0) {
            return '<p>No contacts found.</p>';
        }

        return `<table role="grid">
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
        return `<tr>
            <td>${HtmlUtils.escapeHtml(contact.firstName)}</td>
            <td>${HtmlUtils.escapeHtml(contact.lastName)}</td>
            <td>${HtmlUtils.escapeHtml(contact.email)}</td>
            <td>${HtmlUtils.escapeHtml(contact.phone)}</td>
            <td><a href="/contacts/${contact.id}/edit" role="button">Edit</a></td>
            <td><a href="/contacts/${contact.id}" role="button">View</a></td>
        </tr>`;
    }
}
