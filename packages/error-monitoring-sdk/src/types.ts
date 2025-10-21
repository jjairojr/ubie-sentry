export interface ErrorMonitorConfig {
  projectId: string;
  apiKey: string;
  endpoint: string;
  environment?: string;
  enabled?: boolean;
  debug?: boolean;
}

export interface ErrorContext {
  message: string;
  stack?: string;
  type?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  breadcrumbs?: Breadcrumb[];
}

export interface Breadcrumb {
  category: string;
  message: string;
  timestamp: number;
  level?: 'info' | 'warning' | 'error';
  data?: Record<string, any>;
}

export interface ErrorReport {
  projectId: string;
  apiKey: string;
  error: ErrorContext;
  sdkVersion: string;
  environment?: string;
}

export interface StackFrame {
  file?: string;
  line?: number;
  column?: number;
  function?: string;
}
