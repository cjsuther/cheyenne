import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import CustomError from '../../infraestructure/sdk/error/custom-error';
import MicroserviceError from '../../infraestructure/sdk/error/microservice-error';
import { getTokenFromRequest } from '../authorization/token';
import { addIncidencia } from '../../infraestructure/sdk/error/add-incidencia';
import { NIVEL_CRITICIDAD } from '../../infraestructure/sdk/consts/nivelCriticidad';

export default async function useError (err, req, res, next) {
    if (err) {

        let statusCode;
        if (err instanceof ParameterError) {
            statusCode = 400;
        }
        else if (err instanceof ValidationError) {
            statusCode = 400;
        }
        else if (err instanceof ReferenceError) {
            statusCode = 400;
        }
        else if (err instanceof CustomError) {
            statusCode = 404;
        }
        else if (err instanceof UnauthorizedError) {
            statusCode = 401;
        }
        else if (err instanceof ProcessError) {
            statusCode = 500;
            const token = getTokenFromRequest(req);
            await addIncidencia(err, token, "Error en proceso", NIVEL_CRITICIDAD.MEDIO);
        }
        else if (err instanceof MicroserviceError) {
            statusCode = 500;
            const token = getTokenFromRequest(req);
            await addIncidencia(err, token, "Error en microservicio", NIVEL_CRITICIDAD.ALTO);
        }
        else {
            console.error(`Error no capturado: ${err}`);
            statusCode = err.statusCode ?? 500;
        }

        const httpError = {
            statusCode: statusCode,
            message: err.message
        }

        return res.status(httpError.statusCode).send(httpError);
    }

    next();
}
