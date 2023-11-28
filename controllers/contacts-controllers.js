import HttpError from '../helpers/HttpError.js';
import Contact from '../models/Contact.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

const throwError = (result, id) => {
  if (!result) {
    throw HttpError(404, `id: ${id} not found`);
  }
};

const getAll = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findById(id);

  throwError(result, id);

  res.json(result);
};

const addContact = async (req, res, next) => {
  const result = await Contact.create(req.body);

  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  throwError(result, id);

  res.json({ message: 'contact deleted' });
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body);

  throwError(result, id);

  res.status(200).json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};
