import { Contact } from "../../models/contact.ts";
import { HtmlUtils } from "../utils/html-utils.ts";

export class ContactDetails {
    static render(contact: Contact): string {
        return `
            <div class="grid">
                <h2>Contact Details</h2>
                <article>
                    <div class="grid">
                        <div>
                            <strong>First Name:</strong>
                            <p>${HtmlUtils.escapeHtml(contact.firstName)}</p>
                        </div>
                        <div>
                            <strong>Last Name:</strong>
                            <p>${HtmlUtils.escapeHtml(contact.lastName)}</p>
                        </div>
                    </div>
                    <div>
                        <strong>Email:</strong>
                        <p>${HtmlUtils.escapeHtml(contact.email)}</p>
                    </div>
                    <div>
                        <strong>Phone:</strong>
                        <p>${HtmlUtils.escapeHtml(contact.phone)}</p>
                    </div>
                    <div class="grid">
                        <a href="/contacts/${contact.id}/edit" role="button">Edit Contact</a>
                        <a href="/contacts" role="button" class="secondary">Back to Contacts</a>
                    </div>
                </article>
            </div>`;
    }
}
