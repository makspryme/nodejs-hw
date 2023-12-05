import express from 'express';
import controllers from '../../controllers/auth-controllers.js';
import isEmptyBody from '../../middlewares/isEmprtyBody.js';
import isValidBody from '../../middlewares/isValidBody.js';
import { userSignInSchema, userSignupSchema } from '../../models/User.js';
import authenticate from '../../middlewares/authenticate.js';
import upload from '../../middlewares/upload.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  upload.single('avatarURL'),
  isEmptyBody,
  isValidBody(userSignupSchema),
  controllers.signUp
);

authRouter.post(
  '/login',
  isEmptyBody,
  isValidBody(userSignInSchema),
  controllers.signIn
);

authRouter.post('/logout', authenticate, controllers.logout);

authRouter.get('/current', authenticate, controllers.getCurrentUser);

authRouter.post(
  '/avatars',
  upload.single('avatarURL'),
  authenticate,
  controllers.changeAvatar
);

export default authRouter;
