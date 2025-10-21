export class GlobalErrorHandler {
  private onError: (error: Error) => void;

  constructor(onError: (error: Error) => void) {
    this.onError = onError;
  }

  attach(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handleRejection);
  }

  detach(): void {
    if (typeof window === 'undefined') return;

    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handleRejection);
  }

  private handleError = (event: ErrorEvent): void => {
    this.onError(event.error || new Error(event.message));
  };

  private handleRejection = (event: PromiseRejectionEvent): void => {
    this.onError(event.reason || new Error('Unhandled Promise Rejection'));
  };
}
