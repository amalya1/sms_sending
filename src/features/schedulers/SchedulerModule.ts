import { Module } from '@nestjs/common';
import { SchedulerHandler } from './handlers/SchedulerHandler';
import { CampaignsSchedulerHandler } from './handlers/CampaignsSchedulerHandler';
import { ContextModule } from '../../common/context/ContextModule';
import { CampaignsRepositoryModule } from '../campaigns/repository/CampaignsRepositoryModule';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ContextModule,
    CampaignsRepositoryModule,
    ScheduleModule.forRoot()
  ],
  exports: [SchedulerHandler],
  providers: [
    {
      provide: SchedulerHandler,
      useClass: CampaignsSchedulerHandler,
    },
  ],
})
export class SchedulerModule {
}
