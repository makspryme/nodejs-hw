import HttpError from '../helpers/HttpError.js';
import Contact from '../models/Contact.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

const throwError = (result, id) => {
  if (!result) {
    throw HttpError(404, `id: ${id} not found`);
  }
};

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 1 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Contact.find({ owner }, '', { skip, limit }).populate(
    'owner',
    'email'
  );
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOne({ _id: id, owner });

  throwError(result, id);

  res.json(result);
};

const addContact = async (req, res) => {
  console.log(req.user);
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });

  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndDelete({ _id: id, owner });
  throwError(result, id);

  res.json({ message: 'contact deleted' });
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndUpdate(
    { _id: id, owner },
    { ...req.body, owner }
  );

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
