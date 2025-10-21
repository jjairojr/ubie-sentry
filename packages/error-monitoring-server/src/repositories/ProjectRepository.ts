import { PrismaClient } from '@prisma/client';
import { Project } from '../types';

export class ProjectRepository {
  constructor(private prisma: PrismaClient) {}

  async create(id: string, name: string, apiKey: string): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        id,
        name,
        apiKey
      }
    });
    return this.mapToProject(project);
  }

  async findByApiKey(apiKey: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { apiKey }
    });
    return project ? this.mapToProject(project) : null;
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id }
    });
    return project ? this.mapToProject(project) : null;
  }

  private mapToProject(project: any): Project {
    return {
      id: project.id,
      name: project.name,
      apiKey: project.apiKey,
      createdAt: project.createdAt.getTime()
    };
  }
}
