export abstract class QueueWorker {
  abstract process(): Promise<void>
}
