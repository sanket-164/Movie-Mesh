import AuthConsumer from "./consumer/auth.consumer";
import SearchConsumer from "./consumer/search.consumer";

// Application bootstrap
class ConsumerManager {
    private consumers;

    constructor() {
        this.consumers = [
            new AuthConsumer(),
            new SearchConsumer(),
        ];
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
