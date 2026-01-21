import express from 'express';

class AuthenticationServer {
    private app: express.Express;
    private port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Authentication server is running on port ${this.port}`);
        });
    }
}

const server = new AuthenticationServer(3000);
server.listen();