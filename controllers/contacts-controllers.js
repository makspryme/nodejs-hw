import Joi from 'joi';
import contactService from '../models/contacts.js';
import HttpError from '../helpers/HttpError.js';

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const getAll = async (req, res) => {
  try {
    const result = await contactService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactService.getContactById(id);

    if (!result) {
      throw HttpError(404, `id: ${id} not found`);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);

    if (error) {
      throw HttpError(404, error);
    }

    const result = await contactService.addContact(req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactService.removeContact(id);

    if (!result) {
      throw HttpError(404, `id: ${id} not found`);
    }

    res.json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);

    if (error) {
      throw HttpError(404, error);
    }

    const { id } = req.params;
    const result = await contactService.updateContact(id, req.body);

    if (!result) {
      throw HttpError(404, `id: ${id} not found`);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  getById,
  deleteContact,
  addContact,
  updateContact,
};
