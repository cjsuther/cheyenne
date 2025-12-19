import container from '../../infraestructure/ioc/dependency-injection';
import SesionService from '../../domain/services/sesion-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';


export default async function useAuth (req, res, next) {
    try {
        const token = getTokenFromRequest(req);
        const data = verifyAccessToken(token);
        if (!data) {
            next(new UnauthorizedError('Token inválido'));
        }
        else {
            const sesionService = container.resolve("sesionService") as SesionService;
            try {
                const sesion = await sesionService.findByToken(token);
                next();
            } catch(error) {
                next(error);
            };
        }
    } catch (error) {
        next(new ProcessError('Error procesando datos', error))
    }
}
