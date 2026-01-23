import { Request, Response, NextFunction } from "express";
import JwtUtil from "../util/jwt";

type decodedToken = {
    id: number;
    iat: number;
    exp: number;
};

class SearchMiddleware {
    public static authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'You are not authorized' });
            return;
        }

        try {
            const decoded = JwtUtil.verifyToken(token) as decodedToken;
            console.log("Authenticated user ID:", decoded.id);
            req.user = decoded.id;
            next();
        } catch (error) {
            res.status(403).json({ error: 'You are not authenticated' });
        }
    }
}

export default SearchMiddleware;