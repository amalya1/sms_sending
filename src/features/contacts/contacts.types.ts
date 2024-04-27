export const ContactStatusOptions = ['active', 'deleted'] as const;
export type ContactStatus = typeof ContactStatusOptions[number];

export const ContactValidStatusOptions = ['valid', 'invalid'] as const;
export type ContactValidStatus = typeof ContactValidStatusOptions[number];

export const ContactSourceTypeOptions = ['company', 'contact'] as const;
export type ContactSourceType = typeof ContactSourceTypeOptions[number];

