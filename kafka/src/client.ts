import kafka from 'kafkajs';

class KafkaClient {
    private static instance: KafkaClient;
    public kafka: kafka.Kafka;

    private constructor() {
        this.kafka = new kafka.Kafka({
            clientId: "movie-search-service",
            brokers: ["localhost:9092"],
        });
    }

    public static getInstance(): KafkaClient {
        if (!KafkaClient.instance) {
            KafkaClient.instance = new KafkaClient();
        }

        return KafkaClient.instance;
    }
}

export default KafkaClient;