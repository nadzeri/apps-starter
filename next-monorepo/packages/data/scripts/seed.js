const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: ".env.local",
});

const parsedUrl = new URL(process.env.DATABASE_URL);

const host = parsedUrl.hostname;

if (!["localhost", "127.0.0.1", "postgres"].some((url) => url === host)) {
  console.log("Remote database detected. Exiting seed script.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
// Path to your seed.sql file
const seedFilePath = path.join(__dirname, "seed.sql");

// Function to run the seed.sql file
const runSeed = async () => {
  try {
    console.log("Connecting to the database");

    const seedQuery = fs.readFileSync(seedFilePath, "utf-8");
    await pool.query(seedQuery);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await pool.end();
    console.log("Disconnected from the database");
  }
};

runSeed();
