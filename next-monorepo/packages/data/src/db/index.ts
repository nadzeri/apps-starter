export * from "./userSchema";

import { drizzle } from "drizzle-orm/node-postgres";
import { Client, Pool } from "pg";
import { patchPgClient } from "../lib/utils/otelPgPatch";

import * as userSchema from "./userSchema";

let connection: Pool | Client;

if (process.env.NODE_ENV === "production") {
  connection = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.SUPABASE_CA_CERT
      ? {
          ca: Buffer.from(process.env.SUPABASE_CA_CERT, "base64").toString(),
          requestCert: true,
          rejectUnauthorized: true,
        }
      : false,
  });
} else {
  let globalConnection = global as typeof globalThis & {
    connection: Client;
  };

  if (!globalConnection.connection) {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    (async () => await client.connect())().catch((err) => {
      console.error("Error connecting to the database", err);
    });

    globalConnection.connection = client;
  }

  connection = globalConnection.connection;
}

patchPgClient(connection);

export const db = drizzle(connection, {
  schema: {
    ...userSchema,
  },
});

export type Db = typeof db;
