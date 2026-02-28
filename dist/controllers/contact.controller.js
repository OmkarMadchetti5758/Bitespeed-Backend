"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const contact_service_1 = require("../services/contact.service");
const contactService = new contact_service_1.ContactService();
class ContactController {
    async identify(req, res) {
        try {
            const { email, phoneNumber } = req.body;
            const result = await contactService.identify(email ?? undefined, phoneNumber?.toString() ?? undefined);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Identify error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.ContactController = ContactController;
