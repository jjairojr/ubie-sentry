import { ErrorReport } from './types';

export class HttpClient {
  private endpoint: string;
  private timeout: number = 5000;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async sendError(report: ErrorReport): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.endpoint}/api/errors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': report.apiKey
        },
        body: JSON.stringify(report),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[ErrorMonitor] Failed to send error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('[ErrorMonitor] Request timeout while sending error');
        } else {
          console.error('[ErrorMonitor] Failed to send error:', error.message);
        }
      }
    }
  }

  async sendBatch(reports: ErrorReport[]): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.endpoint}/api/errors/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': reports[0]?.apiKey || ''
        },
        body: JSON.stringify({ errors: reports }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[ErrorMonitor] Failed to send batch: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('[ErrorMonitor] Failed to send batch:', error.message);
      }
    }
  }
}
