import jwt from 'jsonwebtoken';
import { getNamespace } from 'cls-hooked';
import config from '../configuration/config';


export function  getTokenFromRequest(req) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        return token;
    }
    catch {
        return null;
    }
}

export function generateAccessToken(data) {
    const token = jwt.sign(data, config.TOKEN_SECRET, { expiresIn: config.TOKEN_TIME_EXPIRATION });
    return token;
}

export function verifyAccessToken(token) {
    if (!token) {
        return null;
    }

	try {
		const data = jwt.verify(token, config.TOKEN_SECRET as string);
        return data;
	}
    catch (err) {
		return null;
	}
}

export function getAccessToken() {
    try {
        const localStorage = getNamespace('LocalStorage');
        const token = localStorage.get("accessToken");
        if (token) {
            const dataToken = verifyAccessToken(token);
            if (dataToken) {
                return {
                    token: token,
                    idUsuario: dataToken.idUsuario
                };
            }
        }

        return {
            token: "undefined",
            idUsuario: 0
        };
    }
    catch {
        return {
            token: "undefined",
            idUsuario: 0
        };
    };
}