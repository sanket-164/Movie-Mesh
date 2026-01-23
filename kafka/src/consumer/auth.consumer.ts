import { EachMessagePayload } from "kafkajs";
import KafkaConsumer from "./consumer";
import { prisma } from "../lib/prisma";
import { TOPICS } from "../topics";

class AuthConsumer extends KafkaConsumer {
    constructor() {
        super("user-auth-group", TOPICS.AUTH);
    }

    protected async handleMessage(payload: EachMessagePayload): Promise<void> {
        const { topic, partition, message } = payload;
        const prefix = `${topic} [${partition} | ${message.offset}] / ${message.timestamp}`;
        console.log(`\x1b[32m ${prefix} ${message.value?.toString()} \x1b[0m`);

        const { userId, action } = JSON.parse(message.value!.toString());

        await prisma.authLog.create({
            data: {
                userId,
                action,
                timestamp: new Date(Number(message.timestamp)),
            },
        });
    }
}

export default AuthConsumer;