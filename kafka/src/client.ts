import kafka from 'kafkajs';

class KafkaClient {
    private static instance: KafkaClient;
    public kafka: kafka.Kafka;

    private constructor() {
        this.kafka = new kafka.Kafka({
            clientId: 'movie-search-service',
            brokers: [process.env.KAFKA_BROKER || 'broker:9092'],
            connectionTimeout: 10000,
            retry: {
                initialRetryTime: 5000,
                retries: 20,
            },
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