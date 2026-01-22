import AuthConsumer from "./consumer/auth.consumer";

async function startConsumers() {
    const consumers = [
        new AuthConsumer(),
    ];

    await Promise.all(consumers.map((c) => c.start()));
}

startConsumers().catch(console.error);
