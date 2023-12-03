import HttpError from '../helpers/HttpError.js';
import { contactAddSchema } from '../models/Contact.js';

const isValidBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    next(HttpError(400, error));
  }

  next();
};

export default isValidBody;
