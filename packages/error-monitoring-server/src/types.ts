export interface Project {
  id: string;
  name: string;
  apiKey: string;
  createdAt: number;
}

export interface ErrorData {
  id?: string;
  projectId: string;
  message: string;
  stackTrace: string;
  errorType: string;
  browserInfo: string;
  url: string;
  fingerprint: string;
  occurredAt: number;
  createdAt?: number;
  breadcrumbs?: string;
}

export interface ErrorGroup {
  id: string;
  projectId: string;
  fingerprint: string;
  firstSeen: number;
  lastSeen: number;
  count: number;
  message: string;
  errorType: string;
}

export interface ErrorReport {
  projectId: string;
  apiKey: string;
  error: {
    message: string;
    stack?: string;
    type?: string;
    url: string;
    userAgent: string;
    timestamp: number;
    breadcrumbs?: any[];
  };
  sdkVersion: string;
  environment?: string;
}

export interface BatchErrorRequest {
  errors: ErrorReport[];
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  startDate?: number;
  endDate?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
