import { FastifyRequest, FastifyReply } from 'fastify';
import { ProjectService } from '../services/ProjectService';
import { Validator } from '../utils/Validator';

export class ProjectController {
  constructor(private projectService: ProjectService) {}

  async createProject(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id, name, apiKey } = request.body as any;

      if (!Validator.validateProjectCreation({ id, name, apiKey })) {
        return reply.status(400).send({ error: 'Invalid project data' });
      }

      const project = await this.projectService.createProject(id, name, apiKey);
      return reply.status(201).send(project);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to create project' });
    }
  }

  async getProject(request: FastifyRequest, reply: FastifyReply) {
    try {
      const apiKey = request.headers['x-api-key'] as string;

      if (!apiKey) {
        return reply.status(400).send({ error: 'Missing API key' });
      }

      const project = await this.projectService.getProjectByApiKey(apiKey);
      if (!project) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      return reply.send(project);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch project' });
    }
  }
}
