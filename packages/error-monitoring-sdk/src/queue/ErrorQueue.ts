import { ErrorReport } from '../types';

export class ErrorQueue {
  private queue: ErrorReport[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly QUEUE_FLUSH_INTERVAL = 5000;
  private readonly MAX_QUEUE_SIZE = 10;
  private onFlush: ((reports: ErrorReport[]) => void) | null = null;

  add(report: ErrorReport): void {
    this.queue.push(report);

    if (this.queue.length >= this.MAX_QUEUE_SIZE) {
      this.flush();
    }
  }

  start(onFlush: (reports: ErrorReport[]) => void): void {
    this.onFlush = onFlush;
    this.flushInterval = setInterval(() => {
      this.flush();
    }, this.QUEUE_FLUSH_INTERVAL);
  }

  stop(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flush();
  }

  private flush(): void {
    if (this.queue.length === 0 || !this.onFlush) {
      return;
    }

    const toSend = [...this.queue];
    this.queue = [];
    this.onFlush(toSend);
  }

  clear(): void {
    this.queue = [];
  }
}
