import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { registerRoutes } from "./routes";
import { ProjectRepository } from "./repositories/ProjectRepository";
import { ErrorRepository } from "./repositories/ErrorRepository";
import { ErrorGroupRepository } from "./repositories/ErrorGroupRepository";
import { ProjectService } from "./services/ProjectService";
import { ErrorService } from "./services/ErrorService";
import { ErrorGroupService } from "./services/ErrorGroupService";
import { TrendService } from "./services/TrendService";
import { ProjectController } from "./controllers/ProjectController";
import { ErrorController } from "./controllers/ErrorController";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "127.0.0.1";

async function start() {
  const fastify = Fastify({});

  await fastify.register(fastifyCors, {
    origin: "*",
    credentials: true,
  });

  const prisma = new PrismaClient();

  const projectRepository = new ProjectRepository(prisma);
  const errorRepository = new ErrorRepository(prisma);
  const errorGroupRepository = new ErrorGroupRepository(prisma);

  const projectService = new ProjectService(projectRepository);
  const errorService = new ErrorService(errorRepository, errorGroupRepository);
  const errorGroupService = new ErrorGroupService(errorGroupRepository);
  const trendService = new TrendService(errorRepository, errorGroupRepository);

  const projectController = new ProjectController(projectService);
  const errorController = new ErrorController(
    errorService,
    projectService,
    errorGroupService,
    trendService,
  );

  const demoProject = await projectService.getProjectByApiKey("demo-key-12345");
  if (!demoProject) {
    await projectService.createProject(
      "demo-project",
      "Demo Project",
      "demo-key-12345",
    );
    console.log(
      "✓ Created demo project with ID: demo-project, API Key: demo-key-12345",
    );
  } else {
    console.log(
      `✓ Demo project already exists with ID: ${demoProject.id}`,
    );
  }

  await registerRoutes(fastify, errorController, projectController);

  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`✓ Server running at http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  process.on("SIGINT", async () => {
    console.log("\n✓ Shutting down gracefully...");
    await prisma.$disconnect();
    await fastify.close();
    process.exit(0);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
