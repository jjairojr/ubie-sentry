import { ErrorMonitorConfig, ErrorContext, ErrorReport, Breadcrumb } from './types';
import { ErrorMonitor } from './core';

export const errorMonitor = ErrorMonitor.getInstance();

export { ErrorMonitor, ErrorMonitorConfig, ErrorContext, ErrorReport, Breadcrumb };
export { GlobalErrorHandler, BreadcrumbHandler } from './handlers';
export { ErrorQueue } from './queue';

export default ErrorMonitor.getInstance();
