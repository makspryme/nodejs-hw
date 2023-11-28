import HttpError from '../helpers/HttpError.js';
import { contactAddSchema } from '../models/Contact.js';

const isValidBody = (req, res, next) => {
  const { error } = contactAddSchema.validate(req.body);
  if (error) {
    next(HttpError(400, error));
  }

  next();
};

export default isValidBody;
