import ProcessError from '../../infraestructure/sdk/error/process-error';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';
import { verifyAccess } from '../authorization/profile';

export default function useAuth (permisos: string | Array<string> = null) {
    return async (req, res, next) => {
        try {
            const token = getTokenFromRequest(req);
            const data = verifyAccessToken(token);
            if (!data) {
                next(new UnauthorizedError('Token inválido'));
            }
            else {
                if (permisos) {
                    if (typeof permisos === 'string') {
                        permisos = [permisos];
                    }
                    // Se obtienen los perfiles del usuario desde el token.
                    const perfiles = data.perfiles as number[];
                    // Chequear el/los permisos/s que entra/n por parámetro directamente.
                    const verified = await verifyAccess(perfiles, permisos);
                    if (verified) {
                        next();   
                    }
                    else {
                        next(new UnauthorizedError('Acción no autorizada'));
                    }
                }
                else {
                    next();
                }
            }
        }
        catch (error) {
            next(new ProcessError('Error procesando datos', error))
        }
    }
}
