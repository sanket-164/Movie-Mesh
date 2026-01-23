import { Kafka } from "kafkajs";

class KafkaClient {
    private static instance: KafkaClient;
    public kafka: Kafka;

    private constructor() {
        this.kafka = new Kafka({
            clientId: "movie-search-service",
            brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
        });
    }

    public static getInstance(): KafkaClient {
        if (!KafkaClient.instance) {
            KafkaClient.instance = new KafkaClient();
        }
        return KafkaClient.instance;
    }

    public getProducer() {
        return this.kafka.producer({
            allowAutoTopicCreation: true
        });
    }
}

export default KafkaClient;