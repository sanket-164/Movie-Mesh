import { PrismaClient } from "@prisma/client";

class PrismaService {
  private static instance: PrismaService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log("Connected to the database successfully!");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      process.exit(1);
    }
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }
}

export const prisma = PrismaService.getInstance().getClient();

export default PrismaService;
