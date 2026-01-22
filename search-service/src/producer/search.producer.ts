import KafkaClient from "../lib/kafka";

type SearchMessagePayload = {
    userId: number;
    query: string;
}

class SearchProducer {
    private static instance: SearchProducer;
    private producer;
    private isConnected = false;

    private constructor() {
        const kafkaClient = KafkaClient.getInstance();
        this.producer = kafkaClient.getProducer();
    }

    public static getInstance(): SearchProducer {
        if (!SearchProducer.instance) {
            SearchProducer.instance = new SearchProducer();
        }
        return SearchProducer.instance;
    }

    public async connect(): Promise<void> {
        if (!this.isConnected) {
            await this.producer.connect();
            this.isConnected = true;
        }
    }

    public async sendMessage(
        topic: string,
        message: SearchMessagePayload
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

export default SearchProducer;