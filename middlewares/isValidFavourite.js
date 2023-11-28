import HttpError from '../helpers/HttpError.js';
import { contactFavoriteSchema } from '../models/Contact.js';

const isValidFavorite = (req, res, next) => {
  const { error } = contactFavoriteSchema.validate(req.body);
  if (error) {
    next(HttpError(400, error));
  }

  next();
};

export default isValidFavorite;
