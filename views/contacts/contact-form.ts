import { Contact } from "../../models/contact.ts";

export class ContactForm {
    static render(contact?: Partial<Contact>): string {
        return `
            <div class="grid">
                <h2>Add New Contact</h2>
            </div>
            <form method="POST" action="/contacts/new">
                <div class="grid">
                    <label for="firstName">
                        First Name
                        <input 
                            type="text" 
                            id="firstName" 
                            name="firstName" 
                            value="${contact?.firstName || ''}"
                            required
                            placeholder="Enter first name">
                    </label>
                    <label for="lastName">
                        Last Name
                        <input 
                            type="text" 
                            id="lastName" 
                            name="lastName" 
                            value="${contact?.lastName || ''}"
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
                        value="${contact?.email || ''}"
                        required
                        placeholder="Enter email address">
                </label>
                <label for="phone">
                    Phone
                    <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value="${contact?.phone || ''}"
                        required
                        placeholder="Enter phone number">
                </label>
                <div class="grid">
                    <button type="submit">Save Contact</button>
                    <a href="/contacts" role="button" class="secondary">Cancel</a>
                </div>
            </form>`;
    }
}
