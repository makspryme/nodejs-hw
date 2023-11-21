import express from 'express';
import controllers from '../../controllers/contacts-controllers.js';
import isEmptyBody from '../../middlewares/isEmprtyBody.js';

const router = express.Router();

router.get('/', controllers.getAll);

router.get('/:id', controllers.getById);

router.post('/', isEmptyBody, controllers.addContact);

router.delete('/:id', controllers.deleteContact);

router.put('/:id', isEmptyBody, controllers.updateContact);

export default router;
