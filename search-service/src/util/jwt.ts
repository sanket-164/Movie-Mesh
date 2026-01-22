import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '12h';

class JwtUtil {
    public static generateToken(payload: object): string {
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    public static verifyToken(token: string): JwtPayload | string {
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        return jwt.verify(token, JWT_SECRET);
    }
}

export default JwtUtil;