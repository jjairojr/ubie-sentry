import { FastifyInstance } from "fastify";
import { ErrorController } from "./controllers/ErrorController";
import { ProjectController } from "./controllers/ProjectController";

export async function registerRoutes(
  fastify: FastifyInstance,
  errorController: ErrorController,
  projectController: ProjectController,
) {
  fastify.get("/health", async () => {
    return { status: "ok" };
  });

  fastify.post("/admin/projects", (request, reply) =>
    projectController.createProject(request, reply),
  );
  fastify.get("/api/projects/me", (request, reply) =>
    projectController.getProject(request, reply),
  );

  fastify.post("/api/errors", (request, reply) =>
    errorController.submitError(request, reply),
  );
  fastify.post("/api/errors/batch", (request, reply) =>
    errorController.submitBatch(request, reply),
  );
  fastify.get("/api/projects/:projectId/errors", (request, reply) =>
    errorController.getErrors(request, reply),
  );
  fastify.get("/api/errors/:errorId", (request, reply) =>
    errorController.getErrorDetail(request, reply),
  );

  fastify.get("/api/projects/:projectId/error-groups", (request, reply) =>
    errorController.getErrorGroups(request, reply),
  );
  fastify.get("/api/projects/:projectId/error-groups/:fingerprint", (request, reply) =>
    errorController.getErrorGroupDetail(request, reply),
  );

  fastify.get("/api/projects/:projectId/trends", (request, reply) =>
    errorController.getTrends(request, reply),
  );
  fastify.get("/api/projects/:projectId/rage-clicks", (request, reply) =>
    errorController.getRageClicks(request, reply),
  );
}
