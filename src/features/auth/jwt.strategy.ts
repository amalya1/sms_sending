import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Sql } from 'postgres';
import { Logger } from '../../common/types/logger.types';
import { Config } from '../../common/config/config';
import { DBConnection } from '../database/database.provider';
import { LoggerToken } from '../logs/logger.provider';
import { ApiAuth, JWTPayload } from './auth.types';
import { AuthService } from './service/AuthService';
import { ContextRepo } from '../../common/types/repository.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {


  constructor(
    private config: Config,
    @Inject(DBConnection) private sql: Sql<never>,
    @Inject(LoggerToken) private logger: Logger,
    @Inject(AuthService) protected readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
      ignoreExpiration: false,
      secretOrKey: config.security.access_token.jwtSecret,
    });
  }

  async validate(payload: JWTPayload): Promise<ApiAuth> {
    return this.authService.authFromUser(this.generateContext(), payload.userId);
  }


  protected generateContext(): ContextRepo {
    return {
      sql: this.sql,
      logger: this.logger,
    };
  }
}
