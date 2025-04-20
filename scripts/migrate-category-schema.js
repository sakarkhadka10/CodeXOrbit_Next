const { PrismaClient } = require("../src/generated/prisma");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting manual migration to use slug as category ID...");

  try {
    // Read the SQL file
    const sqlPath = path.join(
      __dirname,
      "../prisma/migrations/manual_migration.sql"
    );
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Split the SQL into individual statements
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await prisma.$executeRawUnsafe(`${statement};`);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
