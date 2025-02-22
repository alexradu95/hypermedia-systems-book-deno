import { Contact } from "../../models/contact.ts";
import { html } from "../../utils/html-template.ts";

export class ContactDetails {
    static render(contact: Contact): string {
        return html`
            <div class="grid">
                <h2>Contact Details</h2>
                <article>
                    <div class="grid">
                        <div>
                            <strong>First Name:</strong>
                            <p>${contact.firstName}</p>
                        </div>
                        <div>
                            <strong>Last Name:</strong>
                            <p>${contact.lastName}</p>
                        </div>
                    </div>
                    <div>
                        <strong>Email:</strong>
                        <p>${contact.email}</p>
                    </div>
                    <div>
                        <strong>Phone:</strong>
                        <p>${contact.phone}</p>
                    </div>
                    <div class="grid">
                        <a href="/contacts/${contact.id}/edit" role="button">Edit Contact</a>
                        <a href="/contacts" role="button" class="secondary">Back to Contacts</a>
                    </div>
                </article>
            </div>`;
    }
}
