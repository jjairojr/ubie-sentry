import { PrismaClient } from "@prisma/client";
import { ErrorData, ErrorGroup } from "../types";

export class ErrorRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: ErrorData): Promise<string> {
    const error = await this.prisma.error.create({
      data: {
        projectId: data.projectId,
        message: data.message,
        stackTrace: data.stackTrace || "",
        errorType: data.errorType || "Error",
        browserInfo: data.browserInfo || "",
        url: data.url || "",
        fingerprint: data.fingerprint,
        occurredAt: new Date(data.occurredAt),
        breadcrumbs: data.breadcrumbs,
      },
    });
    return error.id;
  }

  async findById(errorId: string): Promise<ErrorData | null> {
    const error = await this.prisma.error.findUnique({
      where: { id: errorId },
    });
    return error ? this.mapToErrorData(error) : null;
  }

  async findByProjectId(
    projectId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<ErrorData[]> {
    const errors = await this.prisma.error.findMany({
      where: { projectId },
      orderBy: { occurredAt: "desc" },
      take: limit,
      skip: offset,
    });
    return errors.map((e) => this.mapToErrorData(e));
  }

  async countByProjectId(projectId: string): Promise<number> {
    return this.prisma.error.count({
      where: { projectId },
    });
  }

  async findByFingerprint(
    projectId: string,
    fingerprint: string,
    limit: number = 50,
  ): Promise<ErrorData[]> {
    const errors = await this.prisma.error.findMany({
      where: {
        projectId,
        fingerprint,
      },
      orderBy: { occurredAt: "desc" },
      take: limit,
    });
    return errors.map((e) => this.mapToErrorData(e));
  }

  async countByProjectIdAndFingerprint(
    projectId: string,
    fingerprint: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return this.prisma.error.count({
      where: {
        projectId,
        fingerprint,
        occurredAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });
  }

  async findErrorsWithRageClicks(projectId: string): Promise<any[]> {
    const errors = await this.prisma.error.findMany({
      where: { projectId },
      select: {
        id: true,
        message: true,
        breadcrumbs: true,
      },
      orderBy: { occurredAt: "desc" },
      take: 1000,
    });
    return errors;
  }

  private mapToErrorData(error: any): ErrorData {
    return {
      id: error.id,
      projectId: error.projectId,
      message: error.message,
      stackTrace: error.stackTrace || "",
      errorType: error.errorType || "Error",
      browserInfo: error.browserInfo || "",
      url: error.url || "",
      fingerprint: error.fingerprint,
      occurredAt: error.occurredAt.getTime(),
      createdAt: error.createdAt.getTime(),
      breadcrumbs: error.breadcrumbs || undefined,
    };
  }
}
