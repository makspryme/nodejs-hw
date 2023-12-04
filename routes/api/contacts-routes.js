import express from 'express';
import controllers from '../../controllers/contacts-controllers.js';
import isEmptyBody from '../../middlewares/isEmprtyBody.js';
import isValidBody from '../../middlewares/isValidBody.js';
import isValidId from '../../middlewares/isValidId.js';
import authenticate from '../../middlewares/authenticate.js';
import {
  contactAddSchema,
  contactFavoriteSchema,
} from '../../models/Contact.js';
import upload from '../../middlewares/upload.js';

const router = express.Router();

router.use(authenticate);

router.get('/', controllers.getAll);

router.get('/:id', isValidId, controllers.getById);

router.post(
  '/',
  upload.single('avatar'),
  isEmptyBody,
  isValidBody(contactAddSchema),
  controllers.addContact
);

router.delete('/:id', isValidId, controllers.deleteContact);

router.put(
  '/:id',
  isValidBody(contactAddSchema),
  isEmptyBody,
  isValidId,
  controllers.updateContact
);

router.patch(
  '/:id/favorite',
  isValidBody(contactFavoriteSchema),
  isValidId,
  controllers.updateContact
);

export default router;
