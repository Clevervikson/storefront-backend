import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { sign } from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';

const jwToken: Secret = process.env.TOKEN_SECRET as Secret;

function verifyUser(req: Request, userId?: number): number {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error('Authontication incomplete');
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = verify(token, jwToken) as JwtPayload;
        const jwtUserId = decoded?.user?.user_id;
        if (userId && jwtUserId !== userId) {
            throw new Error('access denied');
        }
        if (!jwtUserId) {
            throw new Error('token not wrong');
        }
        return jwtUserId as number;
    } catch (err) {
        throw new Error(`unable to verify user ${err}`);
    }
}

function signIn(userId: number): string {
    try {
        const token = sign({ user: { userId } }, jwToken, { expiresIn: '24h' });
        return token;
    } catch (err) {
        throw new Error(`signin error ${err}`);
    }
}

export { verifyUser, signIn };
