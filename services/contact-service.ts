import { Contact } from "../models/contact.ts";

export class ContactService {
    private contacts: Contact[] = [
        { id: 1, firstName: "John", lastName: "Doe", email: "john.doe@example.com", phone: "+1234567890" },
        { id: 2, firstName: "Jane", lastName: "Doe", email: "jane.doe@example.com", phone: "+1234567891" },
        { id: 3, firstName: "Alice", lastName: "Smith", email: "alice.smith@example.com", phone: "+1234567892" },
        { id: 4, firstName: "Bob", lastName: "Johnson", email: "bob.johnson@example.com", phone: "+1234567893" },
        { id: 5, firstName: "Michael", lastName: "Brown", email: "michael.brown@example.com", phone: "+1234567894" },
        { id: 6, firstName: "Sarah", lastName: "Lee", email: "sarah.lee@example.com", phone: "+1234567895" },
        { id: 7, firstName: "Tom", lastName: "Davis", email: "tom.davis@example.com", phone: "+1234567896" },
        { id: 8, firstName: "Jerry", lastName: "Miller", email: "jerry.miller@example.com", phone: "+1234567897" },
        { id: 9, firstName: "Harry", lastName: "Wilson", email: "harry.wilson@example.com", phone: "+1234567898" },
        { id: 10, firstName: "Ron", lastName: "Anderson", email: "ron.anderson@example.com", phone: "+1234567899" }
    ];

    getAllContacts(): Contact[] {
        return this.contacts;
    }

    searchContacts(query: string): Contact[] {
        if (!query) return this.contacts;
        
        const lowercaseQuery = query.toLowerCase();
        return this.contacts.filter(contact =>
            contact.firstName.toLowerCase().includes(lowercaseQuery) ||
            contact.lastName.toLowerCase().includes(lowercaseQuery) ||
            contact.email.toLowerCase().includes(lowercaseQuery) ||
            contact.phone.includes(query)
        );
    }

    getContactById(id: number): Contact | undefined {
        return this.contacts.find(contact => contact.id === id);
    }

    createContact(contact: Omit<Contact, "id">): Contact {
        const newContact = {
            id: Math.max(...this.contacts.map(c => c.id), 0) + 1,
            ...contact
        };
        this.contacts.push(newContact);
        return newContact;
    }

    getContact(id: number): Contact | undefined {
        return this.contacts.find(contact => contact.id === id);
    }

    updateContact(id: number, updatedContact: Contact): Contact | undefined {
        const index = this.contacts.findIndex(contact => contact.id === id);
        if (index === -1) return undefined;
        
        this.contacts[index] = updatedContact;
        return updatedContact;
    }
}
