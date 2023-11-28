import express from 'express';
import controllers from '../../controllers/contacts-controllers.js';
import isEmptyBody from '../../middlewares/isEmprtyBody.js';
import isValidBody from '../../middlewares/isValidBody.js';
import isValidId from '../../middlewares/isValidId.js';
import isValidFavorite from '../../middlewares/isValidFavourite.js';

const router = express.Router();

router.get('/', controllers.getAll);

router.get('/:id', isValidId, controllers.getById);

router.post('/', isEmptyBody, isValidBody, controllers.addContact);

router.delete('/:id', isValidId, controllers.deleteContact);

router.put(
  '/:id',
  isValidBody,
  isEmptyBody,
  isValidId,
  controllers.updateContact
);

router.patch(
  '/:id/favorite',
  isValidBody,
  isValidFavorite,
  isValidId,
  controllers.updateContact
);

export default router;
