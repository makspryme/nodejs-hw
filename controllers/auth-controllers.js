import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import Jimp from 'jimp';
import gravatar from 'gravatar';

const { JWT_SECRET } = process.env;

const avatarPath = path.resolve('public', 'avatars');

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const dataBaseEmail = await User.findOne({ email });
  console.log(dataBaseEmail);
  if (dataBaseEmail) {
    throw HttpError(409, 'Email already exist');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(req.body.email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const signIn = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Username or password invalid');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.json({ message: 'Success logout' });
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const changeAvatar = async (req, res) => {
  const { _id } = req.user;

  ////
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  await Jimp.read(oldPath).then((image) =>
    image.resize(250, 250).write(oldPath)
  );
  const avatarURL = path.join('avatars', filename);
  await fs.rename(oldPath, newPath);
  ////

  await User.findByIdAndUpdate(_id, { avatarURL });
  console.log(avatarURL);

  res.json({ avatarURL });
};

export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logout: ctrlWrapper(logout),
  changeAvatar: ctrlWrapper(changeAvatar),
};
