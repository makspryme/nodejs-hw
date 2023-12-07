import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import Jimp from 'jimp';
import gravatar from 'gravatar';
import { nanoid } from 'nanoid';
import sendEmail from '../helpers/sendEmail.js';

const { JWT_SECRET, BASE_URL } = process.env;

const avatarPath = path.resolve('public', 'avatars');

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const dataBaseEmail = await User.findOne({ email });
  if (dataBaseEmail) {
    throw HttpError(409, 'Email already exist');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(req.body.email);

  const verificationToken = nanoid();

  const mail = {
    to: email,
    subjet: 'Some text',
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Verify email</a>`,
  };

  await sendEmail(mail);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw (HttpError(404), 'Not found');
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: ' ',
  });

  res.json({ message: 'Email success verify' });
};

const resend = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, 'Not found');
  }
  if (user?.verificationToken === ' ') {
    throw HttpError(400, 'Verification has already been passed');
  }

  const mail = {
    to: email,
    subjet: 'Some text',
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Verify email</a>`,
  };

  await sendEmail(mail);

  res.json({ message: 'Check your email' });
};

const signIn = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }

  if (!user.verify) {
    throw HttpError(401, 'Email not verify');
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

  // const { path: oldPath = undefined, filename = undefined } = req.file;
  const oldPath = req.file?.path;
  const filename = req.file?.filename;

  if (!filename) {
    throw HttpError(400, 'Must have file');
  }

  const newPath = path.join(avatarPath, filename);
  await Jimp.read(oldPath).then((image) =>
    image.resize(250, 250).write(oldPath)
  );
  const avatarURL = path.join('avatars', filename);
  await fs.rename(oldPath, newPath);
  ////

  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

export default {
  signUp: ctrlWrapper(signUp),
  verify: ctrlWrapper(verify),
  resend: ctrlWrapper(resend),
  signIn: ctrlWrapper(signIn),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logout: ctrlWrapper(logout),
  changeAvatar: ctrlWrapper(changeAvatar),
};
