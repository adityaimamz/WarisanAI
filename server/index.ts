import app, { prisma } from "./app.js";

const requiredEnvVars = ["VITE_NEON_AUTH_URL", "DATABASE_URL"] as const;
const recommendedEnvVars = ["NEON_AUTH_ISSUER", "CORS_ALLOWED_ORIGINS"] as const;

const validateEnv = () => {
  const isProduction = process.env.NODE_ENV === "production";
  for (const key of requiredEnvVars) {
    if (!process.env[key]?.trim()) {
      throw new Error(`Required environment variable ${key} is not set.`);
    }
  }
  for (const key of recommendedEnvVars) {
    if (!process.env[key]?.trim()) {
      const level = isProduction ? "error" : "warn";
      if (level === "error") {
        throw new Error(`${key} must be configured in production.`);
      } else {
        console.warn(`[env] ${key} is not configured.`);
      }
    }
  }
};

validateEnv();

const isProductionStart =
  process.env.NODE_ENV === "production" || process.env.npm_lifecycle_event === "start";
const fallbackPort = isProductionStart ? 8080 : 3001;
const PORT = Number(process.env.PORT ?? fallbackPort);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
