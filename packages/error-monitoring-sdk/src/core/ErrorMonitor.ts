import { ErrorMonitorConfig, ErrorContext, ErrorReport, Breadcrumb } from '../types';
import { HttpClient } from '../http-client';
import { BreadcrumbTracker } from '../breadcrumb-tracker';
import { GlobalErrorHandler } from '../handlers/GlobalErrorHandler';
import { BreadcrumbHandler } from '../handlers/BreadcrumbHandler';
import { ErrorQueue } from '../queue/ErrorQueue';

export class ErrorMonitor {
  private static instance: ErrorMonitor | null = null;
  private config: ErrorMonitorConfig | null = null;
  private httpClient: HttpClient | null = null;
  private breadcrumbTracker: BreadcrumbTracker = new BreadcrumbTracker();
  private errorQueue: ErrorQueue;
  private globalErrorHandler: GlobalErrorHandler | null = null;
  private breadcrumbHandler: BreadcrumbHandler | null = null;
  private readonly SDK_VERSION = '1.0.0';

  private constructor() {
    this.errorQueue = new ErrorQueue();
  }

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  init(config: ErrorMonitorConfig): void {
    if (this.config) {
      console.warn('[ErrorMonitor] Already initialized');
      return;
    }

    this.config = {
      enabled: true,
      ...config
    };

    this.httpClient = new HttpClient(this.config.endpoint);

    if (this.config.debug) {
      console.log('[ErrorMonitor] Initialized with config:', this.config);
    }

    this.setupHandlers();
    this.errorQueue.start((reports) => this.flushQueue(reports));
  }

  private setupHandlers(): void {
    if (typeof window === 'undefined') return;

    this.globalErrorHandler = new GlobalErrorHandler((error) => this.captureException(error));
    this.globalErrorHandler.attach();

    this.breadcrumbHandler = new BreadcrumbHandler(this.breadcrumbTracker);
    this.breadcrumbHandler.attach();
  }

  captureException(error: Error | string): void {
    if (!this.config?.enabled || !this.httpClient) {
      return;
    }

    const errorContext = this.buildErrorContext(error);
    const report = this.buildErrorReport(errorContext);

    if (this.config.debug) {
      console.log('[ErrorMonitor] Captured error:', report);
    }

    this.errorQueue.add(report);
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (!this.config?.enabled || !this.httpClient) {
      return;
    }

    const error = new Error(message);
    error.name = level.charAt(0).toUpperCase() + level.slice(1);
    this.captureException(error);
  }

  addBreadcrumb(breadcrumb: Breadcrumb): void {
    this.breadcrumbTracker.addBreadcrumb(breadcrumb);
  }

  private buildErrorContext(error: Error | string): ErrorContext {
    const isError = error instanceof Error;
    const message = isError ? error.message : String(error);
    const stack = isError ? error.stack || '' : '';
    const type = isError ? error.name : 'Error';
    const breadcrumbs = this.breadcrumbTracker.getBreadcrumbs();

    if (this.config?.debug) {
      console.log('[ErrorMonitor] Breadcrumbs collected:', breadcrumbs.length, breadcrumbs);
    }

    return {
      message,
      stack,
      type,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: Date.now(),
      breadcrumbs
    };
  }

  private buildErrorReport(errorContext: ErrorContext): ErrorReport {
    if (!this.config) {
      throw new Error('ErrorMonitor not initialized');
    }

    return {
      projectId: this.config.projectId,
      apiKey: this.config.apiKey,
      error: errorContext,
      sdkVersion: this.SDK_VERSION,
      environment: this.config.environment
    };
  }

  private flushQueue(reports: ErrorReport[]): void {
    if (!this.httpClient || reports.length === 0) {
      return;
    }

    if (reports.length === 1) {
      this.httpClient.sendError(reports[0]);
    } else {
      this.httpClient.sendBatch(reports);
    }
  }

  destroy(): void {
    this.errorQueue.stop();
    if (this.globalErrorHandler) {
      this.globalErrorHandler.detach();
    }
    if (this.breadcrumbHandler) {
      this.breadcrumbHandler.detach();
    }
    this.breadcrumbTracker.clear();
    this.config = null;
    this.httpClient = null;
  }

  isInitialized(): boolean {
    return this.config !== null;
  }

  setEnabled(enabled: boolean): void {
    if (this.config) {
      this.config.enabled = enabled;
    }
  }
}
