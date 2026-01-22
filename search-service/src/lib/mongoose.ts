import mongoose from "mongoose";

class MongooseService {
    private static instance: MongooseService;

    private constructor() {}

    public static getInstance(): MongooseService {
        if (!MongooseService.instance) {
            MongooseService.instance = new MongooseService();
        }
        return MongooseService.instance;
    }

    public async connect(uri: string): Promise<void> {
        try {
            await mongoose.connect(uri);
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw error;
        }
    }
}

export default MongooseService;