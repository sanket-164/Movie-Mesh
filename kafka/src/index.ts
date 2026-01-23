import AuthConsumer from "./consumer/auth.consumer";
import SearchConsumer from "./consumer/search.consumer";
import PrismaService from "./lib/prisma";

class ConsumerManager {
    private consumers;

    constructor() {
        this.consumers = [
            new AuthConsumer(),
            new SearchConsumer(),
        ];
        this.connectDatabase();
    }

    private async connectDatabase(): Promise<void> {
        try {
            await PrismaService.getInstance().connect();
            console.log("\x1b[34mConnected to MySQL successfully!\x1b[0m");
        } catch (error) {
            console.error('\x1b[31mFailed to connect to MySQL\x1b[0m', error);
        }
    }

    public async start(): Promise<void> {
        try {
            await Promise.all(this.consumers.map(consumer => consumer.start()));
        } catch (error) {
            console.error("Failed to start consumers:", error);
        }
    }
}

new ConsumerManager().start();
