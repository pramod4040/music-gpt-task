import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

if (!process.env.DATABASE_URL) {
  const env = process.env.APP_ENV || "development";
  dotenv.config({ path: `.env.${env}` });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
