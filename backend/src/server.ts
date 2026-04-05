import app from "./app";
import { PrismaClient } from "@prisma/client";

const PORT = process.env.PORT || 5000;
export const prisma = new PrismaClient();

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

startServer();
