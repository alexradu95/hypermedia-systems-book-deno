import { Contact } from "../../models/contact.ts";
import { HtmlTemplate } from "../../framework/template/html.ts";

export class ContactForm {
    static render(contact?: Partial<Contact>): string {
        const template = new HtmlTemplate(`
            <div class="grid">
                <h2>{{title}}</h2>
            </div>
            <form method="POST" action="{{action}}">
                <div class="grid">
                    <label for="firstName">
                        First Name
                        <input 
                            type="text" 
                            id="firstName" 
                            name="firstName" 
                            value="{{firstName}}"
                            required
                            placeholder="Enter first name">
                    </label>
                    <label for="lastName">
                        Last Name
                        <input 
                            type="text" 
                            id="lastName" 
                            name="lastName" 
                            value="{{lastName}}"
                            required
                            placeholder="Enter last name">
                    </label>
                </div>
                <label for="email">
                    Email
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value="{{email}}"
                        required
                        placeholder="Enter email address">
                </label>
                <label for="phone">
                    Phone
                    <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value="{{phone}}"
                        required
                        placeholder="Enter phone number">
                </label>
                <div class="grid">
                    <button type="submit">{{submitText}}</button>
                    <a href="/contacts" role="button" class="secondary">Cancel</a>
                </div>
            </form>`);

        return template.render({
            title: contact?.id ? 'Edit Contact' : 'Add New Contact',
            action: contact?.id ? `/contacts/${contact.id}/edit` : '/contacts/new',
            firstName: contact?.firstName ?? '',
            lastName: contact?.lastName ?? '',
            email: contact?.email ?? '',
            phone: contact?.phone ?? '',
            submitText: contact?.id ? 'Update Contact' : 'Create Contact'
        });
    }
}
