import { Request, Response } from 'express';
import { ContactService } from '../services/contact.service';

const contactService = new ContactService();

export class ContactController {

  async identify(req: Request, res: Response): Promise<void> {
    try {
      const { email, phoneNumber } = req.body;

      const result = await contactService.identify(
        email ?? undefined,
        phoneNumber?.toString() ?? undefined
      );

      res.status(200).json(result);
    } catch (error) {
      console.error('Identify error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}