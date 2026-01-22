import express from 'express';

import AuthController from '../controller/authController';

class AuthRoute {
    public router: express.Router;
    private authController: AuthController = new AuthController();

    constructor() {
        this.router = express.Router();
        this.authController = new AuthController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', (req, res) => {
            res.status(200).send('Auth Service is running');
        });
        this.router.post('/signup', this.authController.signUp);
        this.router.post('/signin', this.authController.signIn);
        this.router.post('/forgot-password', this.authController.forgotPassword);
    }
}

export default AuthRoute;