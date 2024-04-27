export const UserStatusOptions = ['active', 'pending', 'deleted'] as const;
export type UserStatus = typeof UserStatusOptions[number];


export const UserTypeOptions = ['user', 'admin'] as const;
export type UserType = typeof UserTypeOptions[number];
