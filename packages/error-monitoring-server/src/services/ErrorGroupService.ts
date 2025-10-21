import { ErrorGroupRepository } from '../repositories/ErrorGroupRepository';
import { ErrorGroup, PaginatedResponse } from '../types';

export class ErrorGroupService {
  constructor(private errorGroupRepository: ErrorGroupRepository) {}

  async getErrorGroups(projectId: string, limit: number = 50, offset: number = 0): Promise<PaginatedResponse<ErrorGroup>> {
    const [data, total] = await Promise.all([
      this.errorGroupRepository.findByProjectId(projectId, Math.min(limit, 100), offset),
      this.errorGroupRepository.countByProjectId(projectId)
    ]);

    console.log(`[ErrorGroupService] Fetching error groups for project ${projectId}: total=${total}, limit=${limit}, offset=${offset}, returned=${data.length}`);

    return {
      data,
      total,
      limit: Math.min(limit, 100),
      offset
    };
  }

  async getErrorGroupByFingerprint(projectId: string, fingerprint: string): Promise<ErrorGroup | null> {
    return this.errorGroupRepository.findByFingerprint(projectId, fingerprint);
  }
}
