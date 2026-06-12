import prisma from "../lib/prisma.js";

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL Connected via Prisma");

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await prisma.$disconnect();
      console.log("Prisma connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error(`Error connecting to Database: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

