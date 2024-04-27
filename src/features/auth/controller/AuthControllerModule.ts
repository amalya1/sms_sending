import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Config } from '../../../common/config/config';
import { ConfigModule } from '../../config/config.module';
import { DatabaseModule } from '../../database/database.module';
import { LoggerModule } from '../../logs/logger.module';
import { AuthController } from './AuthController';
import { JwtStrategy } from '../jwt.strategy';
import { AuthUseCaseModule } from '../domain/AuthUseCaseModule';
import { AuthServiceModule } from '../service/AuthServiceModule';
import { AuthViewerModule } from '../viewer/AuthViewerModule';
import { ContextModule } from '../../../common/context/ContextModule';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    LoggerModule,
    PassportModule,
    AuthServiceModule,
    AuthViewerModule,
    AuthUseCaseModule,
    ContextModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [Config],
      useFactory: async (config: Config) => ({
        secret: config.security.access_token.jwtSecret,
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [],
  controllers: [AuthController],
})
export class AuthControllerModule {
}
