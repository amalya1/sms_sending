// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JoiTimezone from 'joi-tz';
import * as joi from 'joi';
const joiTz = joi.extend(JoiTimezone);
import { ContactsAddInputBody, ContactSearchInputQuery, ContactUpdateInputBody } from './types';
import { joiCommaStrings, joiCommaUUID } from '../../../common/validation';
import { ContactValidStatusOptions } from '../contacts.types';


export const contactUpdateBodySchema = joi.object<ContactUpdateInputBody>({
  phoneNumber: joi.string().trim().regex(/^\+[1-9]\d{1,14}$/).required(),
  email: joi.string().trim().email().lowercase().empty('').default(null),
  firstName: joi.string().trim().empty('').default(null),
  lastName: joi.string().trim().empty('').default(null),
  birthdate: joi.date().empty('').default(null),
  contactMetadata: joi.string().trim().empty('').default(null),
  timeZone: joiTz.timezone().empty('').default(null),
});

export const contactCSVSchema = contactUpdateBodySchema.unknown();

export const contactsHeadersSchema = joi.array().items(
  joi.string().required().trim().valid('phoneNumber'),
  joi.string().trim()
);

const contactsAddSchema = joi.object<ContactsAddInputBody>({
  phoneNumber: joi.string().trim().regex(/^\+[1-9]\d{1,14}$/).required(),
  email: joi.string().trim().email().lowercase().empty('').default(null),
  firstName: joi.string().trim().empty('').default(null),
  lastName: joi.string().trim().empty('').default(null),
  birthdate: joi.date().empty('').default(null),
  contactMetadata: joi.object().empty('').default(null),
  timeZone: joiTz.timezone().empty('').default(null),
});

export const contactsAddSchemaArray = joi.array().items(contactsAddSchema).unique('phoneNumber');


export const contactSearchQuerySchema = joi.object<ContactSearchInputQuery>({
  validStatus: joi.string().allow('').custom(joiCommaStrings([...ContactValidStatusOptions])).default([]),
  companyId: joi.string().required(),
  groups: joi.string().empty('').custom(joiCommaUUID()).default([]),
  notInGroups: joi.string().empty('').custom(joiCommaUUID()).default([]),
  limit: joi.number().positive().default(20),
  offset: joi.number().min(0).default(0),
})
