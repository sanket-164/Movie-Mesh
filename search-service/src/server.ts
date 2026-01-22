import express from 'express';
import cors from 'cors';
import MongooseService from './lib/mongoose';

class SearchServer {
    private app: express.Express;
    private port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.connectToDatabase();
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
        this.app.use((req, res) => {
            res.status(404).send('Route not found');
        });
    }

    private async connectToDatabase(): Promise<void> {
        const mongooseService = MongooseService.getInstance();
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/moviedb';

        try {
            await mongooseService.connect(mongoUri);
        } catch (error) {
            console.error('Failed to connect to the database', error);
        }
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Search server is listening at http://localhost:${this.port}`);
        });
    }
}

const server = new SearchServer(process.env.PORT ? parseInt(process.env.PORT) : 3000);
server.listen();