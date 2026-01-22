import express from 'express';
import cors from 'cors';
import SearchRoute from './route/search.route';
import MongooseService from './lib/mongoose';
import SearchProducer from './producer/search.producer';

class SearchServer {
    private app: express.Express;
    private port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.connectToDatabase();
        this.connectProducer();
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
    }

    private initializeRoutes(): void {
        this.app.get('/', (req, res) => {
            res.send('Search Server is running');
        });
        this.app.use('/search', new SearchRoute().router);
        this.app.use((req, res) => {
            res.status(404).send('Route not found');
        });
    }

    private async connectToDatabase(): Promise<void> {
        const mongooseService = MongooseService.getInstance();
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/search-service';

        try {
            await mongooseService.connect(mongoUri);
            console.log("\x1b[34mConnected to MongoDB successfully!\x1b[0m");
        } catch (error) {
            console.error('\x1b[31mFailed to connect to MongoDB\x1b[0m', error);
        }
    }

    private async connectProducer(): Promise<void> {
        try {
            await SearchProducer.getInstance().connect();
            console.log("\x1b[34mSearch Producer connected successfully!\x1b[0m");
        } catch (error) {
            console.error('\x1b[31mFailed to connect Search Producer\x1b[0m', error);
        }
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`\x1b[34mSearch server is listening at http://localhost:${this.port}\x1b[0m`);
        });
    }
}

const server = new SearchServer(process.env.PORT ? parseInt(process.env.PORT) : 5000);
server.listen();