import * as joi from 'joi';
import {
  CompanyFilterInputQuery,
  UserChangePasswordInputBody,
  UserChangeRoleInputBody,
  UserInviteInputBody,
  UserSearchInputQuery,
  UserUpdateInputBody,
} from './types';


export const userInviteSchema = joi.object<UserInviteInputBody>({
  email: joi.string().email().required().lowercase().trim(),
  phoneNumber: joi.string().trim().regex(/^\+[1-9]\d{1,14}$/).empty('').default(null),
  firstName: joi.string().required().trim(),
  lastName: joi.string().required().trim(),
  roleId: joi.string().required(),
});

export const companyFilterSchema = joi.object<CompanyFilterInputQuery>({
  companyId: joi.string().required(),
});

export const userChangeRoleSchema = joi.object<UserChangeRoleInputBody>({
  roleId: joi.string().required(),
});

export const userChangePasswordSchema = joi.object<UserChangePasswordInputBody>({
  currentPassword: joi.string().required(),
  password: joi.string().required(),
});

export const userUpdateSchema = joi.object<UserUpdateInputBody>({
  firstName: joi.string().required().trim(),
  lastName: joi.string().required().trim(),
  phoneNumber: joi.string().trim().regex(/^\+[1-9]\d{1,14}$/).empty('').default(null),
});

export const userSearchQuerySchema = joi.object<UserSearchInputQuery>({
  companyId: joi.string().required(),
  query: joi.string().optional().default(null),
  roleId: joi.string().optional().default(null),
  limit: joi.number().positive().default(20),
  offset: joi.number().min(0).default(0),
});
