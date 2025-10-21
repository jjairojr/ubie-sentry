export interface ErrorData {
  id: string
  projectId: string
  message: string
  stackTrace: string
  errorType: string
  browserInfo: string
  url: string
  fingerprint: string
  occurredAt: number
  createdAt: number
}

export interface ErrorGroup {
  id: string
  projectId: string
  fingerprint: string
  firstSeen: number
  lastSeen: number
  count: number
  message: string
  errorType: string
}

export interface ErrorDetailResponse {
  error: ErrorData
  group: ErrorGroup
  similar: Array<ErrorData>
}

export interface ErrorStats {
  total: number
  critical: number
  warning: number
  resolved: number
}

export interface RecentError {
  id: string
  message: string
  type: string
  severity: 'critical' | 'warning' | 'info'
  timestamp: string
  count: number
}

export interface UseErrorsReturn {
  errorGroups: Array<ErrorGroup>
  stats: ErrorStats
  recentErrors: Array<RecentError>
  isLoading: boolean
}
