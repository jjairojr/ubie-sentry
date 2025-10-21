import { ErrorMonitor } from '@ubie/error-monitoring-sdk'

const apiKey = 'demo-key-12345'
const endpoint = 'http://localhost:3000'
const projectId = 'demo-project'

export const errorMonitor = ErrorMonitor.getInstance()

errorMonitor.init({
  apiKey,
  endpoint,
  projectId,
  environment: 'development',
  enabled: true,
  debug: true,
})
