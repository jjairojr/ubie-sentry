import { ProjectRepository } from '../repositories/ProjectRepository';
import { Project } from '../types';

export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {}

  async createProject(id: string, name: string, apiKey: string): Promise<Project> {
    if (!id || !name || !apiKey) {
      throw new Error('Missing required fields: id, name, apiKey');
    }

    return this.projectRepository.create(id, name, apiKey);
  }

  async getProjectByApiKey(apiKey: string): Promise<Project | null> {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    return this.projectRepository.findByApiKey(apiKey);
  }

  async getProjectById(id: string): Promise<Project | null> {
    if (!id) {
      throw new Error('Project ID is required');
    }

    return this.projectRepository.findById(id);
  }

  async verifyProjectAccess(apiKey: string, projectId: string): Promise<boolean> {
    const project = await this.getProjectByApiKey(apiKey);
    return project !== null && project.id === projectId;
  }
}
