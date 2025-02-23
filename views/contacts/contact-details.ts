import { Contact } from "../../models/contact.ts";
import { HtmlTemplate } from "../../framework/template/html.ts";

export class ContactDetails {
    static render(contact: Contact): string {
        const template = new HtmlTemplate(`
            <div class="grid">
                <h2>Contact Details</h2>
                <article>
                    <div class="grid">
                        <div>
                            <strong>First Name:</strong>
                            <p>{{firstName}}</p>
                        </div>
                        <div>
                            <strong>Last Name:</strong>
                            <p>{{lastName}}</p>
                        </div>
                    </div>
                    <div>
                        <strong>Email:</strong>
                        <p>{{email}}</p>
                    </div>
                    <div>
                        <strong>Phone:</strong>
                        <p>{{phone}}</p>
                    </div>
                    <div class="grid">
                        <a href="/contacts/{{id}}/edit" role="button">Edit Contact</a>
                        <a href="/contacts" role="button" class="secondary">Back to Contacts</a>
                    </div>
                </article>
            </div>`);

        return template.render(contact);
    }
}
