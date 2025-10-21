import { FastifyRequest, FastifyReply } from "fastify";
import { ErrorService } from "../services/ErrorService";
import { ProjectService } from "../services/ProjectService";
import { ErrorGroupService } from "../services/ErrorGroupService";
import { TrendService } from "../services/TrendService";
import { Validator } from "../utils/Validator";
import { ErrorReport, BatchErrorRequest } from "../types";

export class ErrorController {
  constructor(
    private errorService: ErrorService,
    private projectService: ProjectService,
    private errorGroupService: ErrorGroupService,
    private trendService: TrendService,
  ) {}

  async submitError(request: FastifyRequest, reply: FastifyReply) {
    try {
      const apiKey = request.headers["x-api-key"] as string;
      const report = request.body as ErrorReport;

      if (!apiKey || !Validator.isValidErrorReport(report)) {
        return reply.status(400).send({ error: "Invalid request" });
      }

      const isAuthorized = await this.projectService.verifyProjectAccess(
        apiKey,
        report.projectId,
      );

      if (!isAuthorized) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const errorId = await this.errorService.submitError(report);

      return reply.status(202).send({
        success: true,
        errorId,
        message: "Error received",
      });
    } catch (error) {
      console.error("[ErrorController] Error in submitError:", error);
      return reply.status(500).send({ error: "Failed to process error" });
    }
  }

  async submitBatch(request: FastifyRequest, reply: FastifyReply) {
    try {
      const apiKey = request.headers["x-api-key"] as string;
      const { errors } = request.body as BatchErrorRequest;

      if (!apiKey || !Array.isArray(errors)) {
        return reply.status(400).send({ error: "Invalid request" });
      }

      for (const report of errors) {
        if (!Validator.isValidErrorReport(report)) {
          continue;
        }

        const isAuthorized = await this.projectService.verifyProjectAccess(
          apiKey,
          report.projectId,
        );
        if (!isAuthorized) {
          continue;
        }

        await this.errorService.submitError(report);
      }

      return reply.status(202).send({
        success: true,
        count: errors.length,
        message: "Batch received",
      });
    } catch (error) {
      return reply.status(500).send({ error: "Failed to process batch" });
    }
  }

  async getErrors(request: FastifyRequest, reply: FastifyReply) {
    try {
      const apiKey = request.headers["x-api-key"] as string;
      const { projectId } = request.params as { projectId: string };
      const query = request.query as any;
      const limit = parseInt(query.limit) || 50;
      const offset = parseInt(query.offset) || 0;

      if (!apiKey) {
        return reply.status(400).send({ error: "Missing API key" });
      }

      const isAuthorized = await this.projectService.verifyProjectAccess(
        apiKey,
        projectId,
      );
      if (!isAuthorized) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const response = await this.errorService.getErrors(
        projectId,
        limit,
        offset,
      );
      return reply.send(response);
    } catch (error) {
      return reply.status(500).send({ error: "Failed to fetch errors" });
    }
  }

  async getErrorDetail(request: FastifyRequest, reply: FastifyReply) {
    try {
      const apiKey = request.headers["x-api-key"] as string;
      const { errorId } = request.params as { errorId: string };

      if (!apiKey) {
        return reply.status(400).send({ error: "Missing API key" });
      }

      const detailResponse = await this.errorService.getErrorDetail(errorId);

      if (!detailResponse.error) {
        return reply.status(404).send({ error: "Error not found" });
      }

      const isAuthorized = await this.projectService.verifyProjectAccess(
        apiKey,
        detailResponse.error.projectId,
      );
      if (!isAuthorized) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      return reply.send(detailResponse);
    } catch (error) {
      return reply.status(500).send({ error: "Failed to fetch error" });
    }
  }

  async getErrorGroups(request: FastifyRequest, reply: FastifyReply) {
    try {
      const apiKey = request.headers["x-api-key"] as string;
      const { projectId } = request.params as { projectId: string };
      const query = request.query as any;
      const limit = parseInt(query.limit) || 50;
      const offset = parseInt(query.offset) || 0;

      console.log(`[ErrorController] getErrorGroups: projectId=${projectId}, apiKey=${apiKey}, limit=${limit}, offset=${offset}`);

      if (!apiKey) {
        return reply.status(400).send({ error: "Missing API key" });
      }

      const isAuthorized = await this.projectService.verifyProjectAccess(
        apiKey,
        projectId,
      );

      console.log(`[ErrorController] Authorization check: isAuthorized=${isAuthorized}`);

      if (!isAuthorized) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const response = await this.errorGroupService.getErrorGroups(
        projectId,
        limit,
        offset,
      );
      return reply.send(response);
    } catch (error) {
      console.error("[ErrorController] Error in getErrorGroups:", error);
      return reply.status(500).send({ error: "Failed to fetch error groups" });
    }
  }

  async getErrorGroupDetail(request: FastifyRequest, reply: FastifyReply) {
    try {
      const apiKey = request.headers["x-api-key"] as string;
      const { projectId, fingerprint } = request.params as {
        projectId: string;
        fingerprint: string;
      };

      if (!apiKey) {
        return reply.status(400).send({ error: "Missing API key" });
      }

      const isAuthorized = await this.projectService.verifyProjectAccess(
        apiKey,
        projectId,
      );
      if (!isAuthorized) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const detailResponse =
        await this.errorService.getErrorDetailByFingerprint(
          projectId,
          fingerprint,
        );

      if (!detailResponse.error) {
        return reply.status(404).send({ error: "Error group not found" });
      }

      return reply.send(detailResponse);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Failed to fetch error group detail" });
    }
  }

  async getTrends(request: FastifyRequest, reply: FastifyReply) {
    try {
      const apiKey = request.headers["x-api-key"] as string;
      const { projectId } = request.params as { projectId: string };

      if (!apiKey) {
        return reply.status(400).send({ error: "Missing API key" });
      }

      const isAuthorized = await this.projectService.verifyProjectAccess(
        apiKey,
        projectId,
      );
      if (!isAuthorized) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const trends = await this.trendService.getErrorTrends(projectId);
      return reply.send({ data: trends });
    } catch (error) {
      console.error("[ErrorController] Error in getTrends:", error);
      return reply.status(500).send({ error: "Failed to fetch trends" });
    }
  }

  async getRageClicks(request: FastifyRequest, reply: FastifyReply) {
    try {
      const apiKey = request.headers["x-api-key"] as string;
      const { projectId } = request.params as { projectId: string };

      if (!apiKey) {
        return reply.status(400).send({ error: "Missing API key" });
      }

      const isAuthorized = await this.projectService.verifyProjectAccess(
        apiKey,
        projectId,
      );
      if (!isAuthorized) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const rageClicks = await this.trendService.getRageClickTrends(projectId);
      return reply.send({ data: rageClicks });
    } catch (error) {
      console.error("[ErrorController] Error in getRageClicks:", error);
      return reply.status(500).send({ error: "Failed to fetch rage clicks" });
    }
  }
}
