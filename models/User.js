import Joi from 'joi';
import { Schema, model } from 'mongoose';
import * as hooks from '../hooks/hooks.js';

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const userVerifyEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

export const userSignupSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

export const userSignInSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    avatarURL: {
      type: String,
    },
    token: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },

  { versionKey: false }
);

userSchema.post('save', hooks.handleSaveError);
userSchema.post('findOneAndUpdate', hooks.handleSaveError);
userSchema.pre('findOneAndUpdate', hooks.preUpdate);

const User = model('user', userSchema);

export default User;
