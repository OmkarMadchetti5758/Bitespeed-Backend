import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';
import { validateIdentifyRequest } from '../middlewares/validate';

const router = Router();
const contactController = new ContactController();

router.post(
  '/identify',
  validateIdentifyRequest,
  contactController.identify.bind(contactController)
);

export default router;