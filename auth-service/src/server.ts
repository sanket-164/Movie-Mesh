import express from 'express';
import cors from 'cors';
import PrismaService from './lib/prisma';
import AuthRoute from './route/auth.route';

class AuthenticationServer {
    private app: express.Express;
    private port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.connectDatabase();
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
        PrismaService.getInstance().connect();
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Authentication server is listening at http://localhost:${this.port}`);
        });
    }
}

const server = new AuthenticationServer(process.env.PORT ? parseInt(process.env.PORT) : 3000);
server.listen();