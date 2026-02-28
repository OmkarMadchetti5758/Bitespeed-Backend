"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const contact_model_1 = require("../models/contact.model");
class ContactService {
    async identify(email, phoneNumber) {
        const matches = await contact_model_1.ContactModel.findEmailOrPhone(email, phoneNumber);
        if (matches.length === 0) {
            const contact = await contact_model_1.ContactModel.createPrimary(email, phoneNumber);
            return this.buildResponse([contact]); //cheeck this later
        }
        const primaryIds = [
            ...new Set(matches.map((c) => c.linkPrecedence === "primary" ? c.id : c.linkedId)),
        ];
        const allContacts = await contact_model_1.ContactModel.findAllByPrimaryIds(primaryIds);
        const primaries = allContacts
            .filter((c) => c.linkPrecedence === "primary")
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const truePrimary = primaries[0];
        for (const p of primaries.slice(1)) {
            await contact_model_1.ContactModel.demoteToSecondary(p.id, truePrimary.id);
        }
        const allEmails = new Set(allContacts.map((c) => c.email).filter(Boolean));
        const allPhones = new Set(allContacts.map((c) => c.phoneNumber).filter(Boolean));
        const hasNewInfo = (email && !allEmails.has(email)) ||
            (phoneNumber && !allPhones.has(phoneNumber));
        if (hasNewInfo) {
            await contact_model_1.ContactModel.createSecondary(email, phoneNumber, truePrimary.id);
        }
        // Step 8: Fetch final state and return
        const finalContacts = await contact_model_1.ContactModel.findAllUnderPrimary(truePrimary.id);
        return this.buildResponse(finalContacts, truePrimary);
    }
    buildResponse(contacts, primary) {
        const truePrimary = primary ?? contacts[0];
        const emails = [
            truePrimary.email,
            ...contacts.filter((c) => c.id !== truePrimary.id).map((c) => c.email),
        ].filter((v, i, a) => v && a.indexOf(v) === i);
        const phoneNumbers = [
            truePrimary.phoneNumber,
            ...contacts
                .filter((c) => c.id !== truePrimary.id)
                .map((c) => c.phoneNumber),
        ].filter((v, i, a) => v && a.indexOf(v) === i);
        const secondaryContactIds = contacts
            .filter((c) => c.linkPrecedence === "secondary")
            .map((c) => c.id);
        return {
            contact: {
                primaryContatctId: truePrimary.id,
                emails,
                phoneNumbers,
                secondaryContactIds,
            },
        };
    }
}
exports.ContactService = ContactService;
