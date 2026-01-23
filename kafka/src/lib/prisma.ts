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
        } catch (error) {
            console.error("Error connecting to the database:", error);
            throw error;
        }
    }

    public getClient(): PrismaClient {
        return this.prisma;
    }
}

export const prisma = PrismaService.getInstance().getClient();

export default PrismaService;
