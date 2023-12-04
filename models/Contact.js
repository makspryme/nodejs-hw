import { Schema, Types, model } from 'mongoose';
import Joi from 'joi';
import * as hooks from '../hooks/hooks.js';

export const contactAddSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

export const contactFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    avatarURL: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false }
);

contactSchema.post('save', hooks.handleSaveError);
contactSchema.post('findOneAndUpdate', hooks.handleSaveError);
contactSchema.pre('findOneAndUpdate', hooks.preUpdate);

const Contact = model('contact', contactSchema);

export default Contact;
