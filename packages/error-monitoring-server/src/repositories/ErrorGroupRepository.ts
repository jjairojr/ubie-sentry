import { PrismaClient } from '@prisma/client';
import { ErrorGroup, ErrorData } from '../types';

export class ErrorGroupRepository {
  constructor(private prisma: PrismaClient) {}

  async findOrCreate(projectId: string, fingerprint: string, error: ErrorData): Promise<ErrorGroup> {
    const existing = await this.prisma.errorGroup.findUnique({
      where: {
        projectId_fingerprint: {
          projectId,
          fingerprint
        }
      }
    });

    if (existing) {
      return this.mapToErrorGroup(existing);
    }

    const created = await this.prisma.errorGroup.create({
      data: {
        projectId,
        fingerprint,
        message: error.message,
        errorType: error.errorType,
        count: 1
      }
    });

    return this.mapToErrorGroup(created);
  }

  async increment(projectId: string, fingerprint: string): Promise<void> {
    await this.prisma.errorGroup.update({
      where: {
        projectId_fingerprint: {
          projectId,
          fingerprint
        }
      },
      data: {
        lastSeen: new Date(),
        count: {
          increment: 1
        }
      }
    });
  }

  async findByProjectId(projectId: string, limit: number = 50, offset: number = 0): Promise<ErrorGroup[]> {
    const groups = await this.prisma.errorGroup.findMany({
      where: { projectId },
      orderBy: { lastSeen: 'desc' },
      take: limit,
      skip: offset
    });
    return groups.map(g => this.mapToErrorGroup(g));
  }

  async countByProjectId(projectId: string): Promise<number> {
    return this.prisma.errorGroup.count({
      where: { projectId }
    });
  }

  async findByFingerprint(projectId: string, fingerprint: string): Promise<ErrorGroup | null> {
    const group = await this.prisma.errorGroup.findUnique({
      where: {
        projectId_fingerprint: {
          projectId,
          fingerprint
        }
      }
    });
    return group ? this.mapToErrorGroup(group) : null;
  }

  async findAllByProjectId(projectId: string): Promise<ErrorGroup[]> {
    const groups = await this.prisma.errorGroup.findMany({
      where: { projectId },
      orderBy: { lastSeen: 'desc' }
    });
    return groups.map(g => this.mapToErrorGroup(g));
  }

  private mapToErrorGroup(group: any): ErrorGroup {
    return {
      id: group.id,
      projectId: group.projectId,
      fingerprint: group.fingerprint,
      firstSeen: group.firstSeen.getTime(),
      lastSeen: group.lastSeen.getTime(),
      count: group.count,
      message: group.message || '',
      errorType: group.errorType || 'Error'
    };
  }
}
