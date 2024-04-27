import jwt from 'jsonwebtoken';
import { Config } from '../../common/config/config';
import { ApiAuth, CompanyUserAuth, JWTPayload, PermissionName, PermissionsByRole } from './auth.types';
import { errorAuth, errorPermissions } from '../../common/errors/errors.types';
import { errorRoleNotFound } from '../roles/domain/errors';
import { EntityId } from '../../common/types/entity.types';



export function authUser(auth: ApiAuth): ApiAuth {
  if (auth.type == 'user' || auth.type == 'admin') return auth;
  throw errorAuth(`Incorrect auth type: ${auth.type}. User type is required.`);
}

export function authComparePermissions(auth: CompanyUserAuth, permissions: string[]): string[] {
  const unique = new Set(auth.permissions);
  return permissions.filter((p) => !unique.has(p));
}

export function authCheckPermissions(auth: CompanyUserAuth, permissions: string[]) {
  const missing = authComparePermissions(auth, permissions);
  if (missing.length > 0) throw errorPermissions(missing);
}

export function authHasPermissions(auth: CompanyUserAuth, permission: string[]): boolean {
  const missing = authComparePermissions(auth, permission);
  return missing.length === 0;
}


export function jwtSign(config: Config, payload: JWTPayload): { accessToken: string, refreshToken: string } {
  const accessToken = jwt.sign(
    payload,
    config.security.access_token.jwtSecret,
    { expiresIn: `${config.security.access_token.jwtExpireMinutes} min` },
  );

  const refreshToken = jwt.sign(
    payload,
    config.security.refresh_token.jwtSecret,
    { expiresIn: `${config.security.refresh_token.jwtExpireDays} days` },
  );

  return { accessToken, refreshToken };
}

export function jwtVerify(config: Config, token: string): JWTPayload {
  return jwt.verify(token, config.security.refresh_token.jwtSecret) as JWTPayload;
}

export function getPermissionsByRole(roleId: EntityId, roleName: string): PermissionName[] {
  const permissions = PermissionsByRole[roleName];
  if (permissions == null) throw errorRoleNotFound(roleId);
  return permissions;
}
