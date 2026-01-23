import { EachMessagePayload } from "kafkajs";
import KafkaConsumer from "./consumer";
import { TOPICS } from "../topics";

class SearchConsumer extends KafkaConsumer {
    constructor() {
        super("user-search-group", TOPICS.SEARCH);
    }

    protected async handleMessage(payload: EachMessagePayload): Promise<void> {
        const { topic, partition, message } = payload;
        const prefix = `${topic} [${partition} | ${message.offset}] / ${message.timestamp}`;
        console.log(`\x1b[32m ${prefix} ${message.value?.toString()} \x1b[0m`);
    }
}

export default SearchConsumer;