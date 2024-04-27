import { Module } from '@nestjs/common';
import { UsersService, UsersServiceImpl } from './UsersService';
import { UsersRepositoryModule } from '../repository/UsersRepositoryModule';

@Module({
  imports: [
    UsersRepositoryModule,
  ],
  exports: [
    UsersService,
  ],
  providers: [
    {
      provide: UsersService,
      useClass: UsersServiceImpl,
    },
  ],
})
export class UsersServiceModule {
}
