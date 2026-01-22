import { Producer } from "kafkajs";
import kafka from "../lib/kafka";

export type AuthMessagePayload = {
    userId: number;
    action: string;
};

class AuthProducer {
    private static instance: AuthProducer;
    private producer: Producer;
    private isConnected = false;

    private constructor() {
        this.producer = kafka.getInstance().getProducer();
    }

    public static getInstance(): AuthProducer {
        if (!AuthProducer.instance) {
            AuthProducer.instance = new AuthProducer();
        }
        return AuthProducer.instance;
    }

    public async connect() {
        if (!this.isConnected) {
            await this.producer.connect();
            this.isConnected = true;
        }
    }

    public async sendMessage(
        topic: string,
        message: AuthMessagePayload
    ) {
        await this.connect();

        await this.producer.send({
            topic,
            messages: [
                {
                    key: message.userId.toString(),
                    value: JSON.stringify(message),
                },
            ],
        });
    }
}

export default AuthProducer;
