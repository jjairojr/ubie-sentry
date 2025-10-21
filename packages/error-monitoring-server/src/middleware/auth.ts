import { FastifyRequest, FastifyReply } from 'fastify';

export async function apiKeyAuth(request: FastifyRequest, reply: FastifyReply) {
}

export function createAuthMiddleware() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey && !request.url.startsWith('/health') && !request.url.startsWith('/admin')) {
      return reply.status(400).send({ error: 'Missing API key' });
    }
  };
}
