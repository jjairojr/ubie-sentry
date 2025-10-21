import { ErrorRepository } from '../repositories/ErrorRepository';
import { ErrorGroupRepository } from '../repositories/ErrorGroupRepository';
import { ErrorData, ErrorReport, PaginatedResponse } from '../types';
import { Fingerprinter } from '../utils/Fingerprinter';

export class ErrorService {
  constructor(
    private errorRepository: ErrorRepository,
    private errorGroupRepository: ErrorGroupRepository
  ) {}

  async submitError(report: ErrorReport): Promise<string> {
    if (!report.projectId || !report.error) {
      throw new Error('Invalid error report');
    }

    const fingerprint = Fingerprinter.generate(
      report.error.type || 'Error',
      report.error.message,
      report.error.stack || ''
    );

    const errorData: ErrorData = {
      projectId: report.projectId,
      message: report.error.message,
      stackTrace: report.error.stack || '',
      errorType: report.error.type || 'Error',
      browserInfo: report.error.userAgent,
      url: report.error.url,
      fingerprint,
      occurredAt: report.error.timestamp,
      breadcrumbs: report.error.breadcrumbs ? JSON.stringify(report.error.breadcrumbs) : undefined
    };

    console.log(`[ErrorService] Submitting error: type=${errorData.errorType}, message=${errorData.message}, fingerprint=${fingerprint}, projectId=${report.projectId}`);

    const errorId = await this.errorRepository.create(errorData);

    const existingGroup = await this.errorGroupRepository.findByFingerprint(report.projectId, fingerprint);

    if (existingGroup) {
      console.log(`[ErrorService] Incrementing existing group: fingerprint=${fingerprint}, oldCount=${existingGroup.count}`);
      await this.errorGroupRepository.increment(report.projectId, fingerprint);
    } else {
      console.log(`[ErrorService] Creating new error group: fingerprint=${fingerprint}`);
      await this.errorGroupRepository.findOrCreate(report.projectId, fingerprint, errorData);
    }

    return errorId;
  }

  async getErrors(projectId: string, limit: number = 50, offset: number = 0): Promise<PaginatedResponse<ErrorData>> {
    const [data, total] = await Promise.all([
      this.errorRepository.findByProjectId(projectId, Math.min(limit, 100), offset),
      this.errorRepository.countByProjectId(projectId)
    ]);

    return {
      data,
      total,
      limit: Math.min(limit, 100),
      offset
    };
  }

  async getErrorDetail(errorId: string): Promise<{
    error: ErrorData | null;
    similar: ErrorData[];
    group: any;
  }> {
    const error = await this.errorRepository.findById(errorId);

    if (!error) {
      return { error: null, similar: [], group: null };
    }

    const [similar, group] = await Promise.all([
      this.errorRepository.findByFingerprint(error.projectId, error.fingerprint, 5),
      this.errorGroupRepository.findByFingerprint(error.projectId, error.fingerprint)
    ]);

    return { error, similar, group };
  }

  async getErrorDetailByFingerprint(projectId: string, fingerprint: string): Promise<{
    error: ErrorData | null;
    similar: ErrorData[];
    group: any;
  }> {
    const [errors, group] = await Promise.all([
      this.errorRepository.findByFingerprint(projectId, fingerprint, 5),
      this.errorGroupRepository.findByFingerprint(projectId, fingerprint)
    ]);

    const error = errors.length > 0 ? errors[0] : null;

    return { error, similar: errors.slice(1), group };
  }
}
