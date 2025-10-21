import { ErrorReport } from '../types';

export class Validator {
  static isValidApiKey(apiKey: string): boolean {
    return typeof apiKey === 'string' && apiKey.length > 0;
  }

  static isValidProjectId(projectId: string): boolean {
    return typeof projectId === 'string' && projectId.length > 0;
  }

  static isValidErrorReport(report: any): boolean {
    return (
      report &&
      typeof report === 'object' &&
      this.isValidProjectId(report.projectId) &&
      this.isValidApiKey(report.apiKey) &&
      report.error &&
      typeof report.error.message === 'string' &&
      typeof report.error.url === 'string'
    );
  }

  static validateProjectCreation(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.id === 'string' &&
      typeof data.name === 'string' &&
      typeof data.apiKey === 'string' &&
      data.id.length > 0 &&
      data.name.length > 0 &&
      data.apiKey.length > 0
    );
  }
}
