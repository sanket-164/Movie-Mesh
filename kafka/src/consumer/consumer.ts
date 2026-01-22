import { Consumer, EachMessagePayload } from "kafkajs";
import KafkaClient from "../client";

abstract class KafkaConsumer {
    protected consumer: Consumer;
    protected topic: string;

    constructor(groupId: string, topic: string) {
        this.topic = topic;
        this.consumer = KafkaClient.getInstance().kafka.consumer({ groupId });
    }

    async start(): Promise<void> {
        await this.consumer.connect();

        await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });

        await this.consumer.run({
            eachMessage: async (payload: EachMessagePayload) => {
                this.handleMessage(payload);
            },
        });
    }

    protected abstract handleMessage(payload: EachMessagePayload): Promise<void>;
}

export default KafkaConsumer;