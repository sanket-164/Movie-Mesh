import crypto from 'crypto';

class CryptoUtil {
    public static hashPassword(password: string): string {
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    public static comparePasswords(plainPassword: string, hashedPassword: string): boolean {
        const hashedPlainPassword = this.hashPassword(plainPassword);
        return hashedPlainPassword === hashedPassword;
    }
}

export default CryptoUtil;