import { SchedulerHandler } from './SchedulerHandler';
import { Inject } from '@nestjs/common';
import { CampaignsRepository } from '../../campaigns/repository/CampaignsRepository';
import { Cron } from '@nestjs/schedule';
import { AppContextProvider } from '../../../common/context/AppContextProvider';
import { ContextRepo } from '../../../common/types/repository.types';
import { dateAddMinutes, dateSubtractMinutes } from '../../../common/utils/utils.base';


export class CampaignsSchedulerHandler implements SchedulerHandler {
  protected readonly ctx: ContextRepo;

  constructor(
  @Inject(CampaignsRepository) protected campaignRepository: CampaignsRepository,
    @Inject(AppContextProvider) private readonly context: AppContextProvider,
  ) {
    this.ctx = context.provide('campaigns-scheduler');
  }


  @Cron('*/60 * * * * *')
  async handleCron(): Promise<void> {
    try {
      this.ctx.logger.info('Campaigns scheduler STARTED');
      const startDate = dateSubtractMinutes(new Date(), 15);
      const endDate = dateAddMinutes(new Date(), 1);
      startDate.setSeconds(0);
      endDate.setSeconds(0);

      const campaigns = await this.campaignRepository.getScheduledCampaigns(this.ctx, startDate, endDate);
      if (campaigns.length != 0) {
        //add to queue, set date_send
        // await this.campaignRepository.setDateSend(this.ctx, campaigns.map(c => c.id));
      }
      this.ctx.logger.info('Campaigns scheduler FINISHED');
    } catch (err) {
      this.ctx.logger.error(`Campaigns scheduler Error: ${err}`);
    }
  }
}
