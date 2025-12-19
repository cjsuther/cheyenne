import express from 'express';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { verifyAccessToken } from '../authorization/token';


export default function useAuth (req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const data = verifyAccessToken(token);
    if (!data) {
        next(new UnauthorizedError('Token inválido'));
    }
    else {
        next();
    }
}

