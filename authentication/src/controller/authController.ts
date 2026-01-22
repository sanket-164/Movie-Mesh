import type { Request, Response } from 'express';
import prisma from '../lib/prisma';

type SignUpBody = {
    name: string;
    email: string;
    password: string;
};

type SignInBody = {
    email: string;
    password: string;
}

type ForgotPasswordBody = {
    email: string;
    password: string;
    newPassword: string;
}

class AuthController {
    public signUp = async (req: Request<{}, {}, SignUpBody, {}>, res: Response): Promise<void> => {
        const { name, email, password } = req.body;

        try {
            if (!name || !email || !password) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }
            
            const existingUser = await prisma.user.findUnique({
                where: { email },
                select: { id: true },
            });

            if (existingUser) {
                res.status(409).json({ error: 'User with this email already exists'});
                return;
            }

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password,
                },
            });

            res.status(201).json({ id: user.id });
        } catch (error) {
            console.error('Error during user sign-up:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public signIn = async (req: Request<{}, {}, SignInBody, {}>, res: Response): Promise<void> => {
        const { email, password } = req.body;

        try {
            if(!email || !password) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            const user = await prisma.user.findUnique({
                where: { email },
                select: { id: true, password: true },
            });

            if (!user || user.password !== password) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            res.status(200).json({ id: user.id });
        } catch (error) {
            console.error('Error during user sign-in:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public forgotPassword = async (req: Request<{}, {}, ForgotPasswordBody, {}>, res: Response): Promise<void> => {
        const { email, password, newPassword } = req.body;

        try {
            if(!email || !password || !newPassword) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            const user = await prisma.user.findUnique({
                where: { email },
                select: { id: true, password: true },
            });

            if (!user || user.password !== password) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            const updatedUser = await prisma.user.update({
                where: { email },
                data: { password: newPassword },
                select: { id: true },
            });

            res.status(200).json({ id: updatedUser.id });
        } catch (error) {
            console.error('Error during user password update:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default AuthController;