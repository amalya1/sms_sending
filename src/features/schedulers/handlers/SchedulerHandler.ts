export abstract class SchedulerHandler {
  abstract handleCron(): Promise<void>
}
