const { Pool } = require("pg");
const { readFile } = require("node:fs/promises");

const DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

async function teardownDatabase() {
  if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  try {
    console.log("Connected to the database...");

    // Read the teardown SQL file
    const teardownQuery = await readFile("./scripts/teardown.sql", "utf8");

    // Execute the SQL
    await pool.query(teardownQuery);
    console.log("Teardown completed successfully.");
  } catch (error) {
    console.error("Error during teardown:", error);
  } finally {
    await pool.end();
    console.log("Database connection closed.");
  }
}

teardownDatabase();
