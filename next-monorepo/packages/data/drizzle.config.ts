import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: ".env.local",
});

const url = process.env.NODE_ENV === "production" ? process.env.DATABASE_URL_PROD! : process.env.DATABASE_URL!;
const parsedUrl = new URL(url);

const database = parsedUrl.pathname.split("/")[1];
const host = parsedUrl.hostname;
const user = parsedUrl.username;
const password = parsedUrl.password;
const port = parseInt(parsedUrl.port);

export default defineConfig({
  schema: ["./src/db/schema.ts", "./src/db/*Schema.ts"],
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url,
    host,
    database,
    user,
    password,
    port: process.env.NODE_ENV === "production" ? 5432 : port, // seems for push using the port from the database url we are using is not working for the prod instant we are using.
    ssl: process.env.SUPABASE_CA_CERT
    ? {
        requestCert: true,
        rejectUnauthorized: true,
        ca: Buffer.from(process.env.SUPABASE_CA_CERT!, "base64").toString(),
      }
    : false
  },
 
});
