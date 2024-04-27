import { EntityId } from '../../common/types/entity.types';


export type ApiAuth = {
  type: 'user' | 'admin'
  userId: EntityId
}

export type CompanyUserAuth = {
  type: 'user' | 'admin'
  userId: EntityId
  companyId: EntityId
  permissions: string[]
}


export type JWTPayload = { userId: EntityId }


export const PermissionNameOptions = [
  'company_user_access',
  'company_manager_access',
  'company_admin_access',
] as const;
export type PermissionName = typeof PermissionNameOptions[number];


export const PermissionsByRole: Record<string, PermissionName[]> = {
  company_admin: ['company_admin_access'],
  company_manager: ['company_manager_access'],
  company_user: ['company_user_access'],
}

