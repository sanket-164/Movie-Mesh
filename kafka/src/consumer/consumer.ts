import { Consumer, EachMessagePayload } from "kafkajs";
import KafkaClient from "../client";

abstract class KafkaConsumer {
    protected consumer: Consumer;
    private topic: string;

    constructor(groupId: string, topic: string) {
        this.topic = topic;
        this.consumer = KafkaClient.getInstance().kafka.consumer({ groupId, allowAutoTopicCreation: true });
    }

    async start(): Promise<void> {
        // Consumer startup
        const maxRetries = 5;
        for (let i = 0; i < maxRetries; i++) {
            try {
                await this.consumer.connect();
                await this.consumer.subscribe({ topic: this.topic });
                break; // Success!
            } catch (e) {
                if (i === maxRetries - 1) throw e;
                console.log(`Retry ${i + 1}/${maxRetries} after topic error...`);
                await new Promise(res => setTimeout(res, 2000 * (i + 1)));
            }
        }

        await this.consumer.run({
            eachMessage: async (payload: EachMessagePayload) => {
                this.handleMessage(payload);
            },
        });
    }

    protected abstract handleMessage(payload: EachMessagePayload): Promise<void>;
}

export default KafkaConsumer;