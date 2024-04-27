import * as joi from 'joi';
import {
  AuthForgotPasswordInputBody,
  AuthLoginInputBody,
  AuthRefreshTokenInputBody,
  AuthSetPasswordInputBody
} from './types';


export const authLoginInputSchema = joi.object<AuthLoginInputBody>({
  email: joi.string().email().required().lowercase().trim(),
  password: joi.string().required(),
});

export const authRefreshTokenInputSchema = joi.object<AuthRefreshTokenInputBody>({
  token: joi.string().required()
});

export const authForgotPasswordInputSchema = joi.object<AuthForgotPasswordInputBody>({
  email: joi.string().email().required().lowercase().trim(),
});

export const authSetPasswordInputSchema = joi.object<AuthSetPasswordInputBody>({
  token: joi.string().required(),
  password: joi.string().required().min(8),
});

