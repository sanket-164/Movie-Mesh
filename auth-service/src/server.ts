import express from 'express';
import cors from 'cors';
import PrismaService from './lib/prisma';
import AuthRoute from './route/auth.route';
import AuthProducer from './producer/auth.producer';

class AuthenticationServer {
    private app: express.Express;
    private port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.connectDatabase();
        this.connectProducer();
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
    }

    private initializeRoutes(): void {
        this.app.get('/', (req, res) => {
            res.send('Authentication Server is running');
        });
        this.app.use('/auth', new AuthRoute().router);
        this.app.use((req, res) => {
            res.status(404).send('Route not found');
        });
    }

    private connectDatabase(): void {
        try {
            PrismaService.getInstance().connect();
            console.log("\x1b[34mConnected to the database successfully!\x1b[0m");
        } catch (error) {
            console.error('\x1b[31mFailed to connect to the database\x1b[0m', error);
        }
    }

    private connectProducer(): void {
        try {
            AuthProducer.getInstance().connect();
            console.log('\x1b[34mKafka Producer connected successfully!\x1b[0m');
        } catch (error) {
            console.error('\x1b[31mFailed to connect Kafka Producer\x1b[0m', error);
        }
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`\x1b[34mAuthentication server is listening at http://localhost:${this.port}\x1b[0m`);
        });
    }
}

const server = new AuthenticationServer(process.env.PORT ? parseInt(process.env.PORT) : 3000);
server.listen();