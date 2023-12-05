import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw HttpError(401, 'Authorization not found');
  }
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    throw HttpError(401);
  }

  try {
    const { id: _id } = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ _id });

    if (!user || !user.token || user.token !== token) {
      throw HttpError(401, 'user not found');
    }

    req.user = user;

    next();
  } catch (error) {
    throw HttpError(401, error.message);
  }
};

export default ctrlWrapper(authenticate);
