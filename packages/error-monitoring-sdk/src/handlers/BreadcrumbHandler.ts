import { BreadcrumbTracker } from '../breadcrumb-tracker';

export class BreadcrumbHandler {
  private breadcrumbTracker: BreadcrumbTracker;
  private originalLog: typeof console.log | null = null;
  private originalWarn: typeof console.warn | null = null;
  private originalError: typeof console.error | null = null;

  constructor(breadcrumbTracker: BreadcrumbTracker) {
    this.breadcrumbTracker = breadcrumbTracker;
  }

  attach(): void {
    if (typeof window === 'undefined') return;

    this.attachClickListener();
    this.attachNavigationListeners();
    this.attachConsoleListeners();
  }

  detach(): void {
    if (typeof window === 'undefined') return;

    this.detachClickListener();
    this.detachNavigationListeners();
    this.detachConsoleListeners();
  }

  private attachClickListener(): void {
    document.addEventListener('click', this.handleClick, true);
  }

  private detachClickListener(): void {
    document.removeEventListener('click', this.handleClick, true);
  }

  private handleClick = (event: Event): void => {
    this.breadcrumbTracker.captureClick(event as MouseEvent);
  };

  private attachNavigationListeners(): void {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = (...args) => {
      this.breadcrumbTracker.captureNavigation(window.location.href);
      return originalPushState.apply(window.history, args);
    };

    window.history.replaceState = (...args) => {
      this.breadcrumbTracker.captureNavigation(window.location.href);
      return originalReplaceState.apply(window.history, args);
    };
  }

  private detachNavigationListeners(): void {
  }

  private attachConsoleListeners(): void {
    this.originalLog = console.log;
    this.originalWarn = console.warn;
    this.originalError = console.error;

    console.log = (...args) => {
      this.breadcrumbTracker.captureConsole('log', args);
      return this.originalLog?.apply(console, args);
    };

    console.warn = (...args) => {
      this.breadcrumbTracker.captureConsole('warn', args);
      return this.originalWarn?.apply(console, args);
    };

    console.error = (...args) => {
      this.breadcrumbTracker.captureConsole('error', args);
      return this.originalError?.apply(console, args);
    };
  }

  private detachConsoleListeners(): void {
    if (this.originalLog) console.log = this.originalLog;
    if (this.originalWarn) console.warn = this.originalWarn;
    if (this.originalError) console.error = this.originalError;
  }
}
