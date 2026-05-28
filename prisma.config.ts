import "dotenv/config";
import { defineConfig } from "prisma/config";

const baseUrl =
  process.env["TURSO_DATABASE_URL"] ??
  process.env["DATABASE_URL"] ??
  "file:./dev.db";

const authToken = process.env["TURSO_AUTH_TOKEN"];

// Embed auth token into the URL for Prisma CLI (db push / migrate)
const url =
  authToken && baseUrl.startsWith("libsql://")
    ? `${baseUrl}?authToken=${authToken}`
    : baseUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: { url },
});
