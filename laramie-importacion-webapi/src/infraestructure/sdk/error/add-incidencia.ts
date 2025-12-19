import container from '../../ioc/dependency-injection';
import { getDateNow } from '../../sdk/utils/convert';
import { verifyAccessToken } from '../../../server/authorization/token';
import PublishService from '../../../domain/services/publish-service';

export async function addIncidencia (err, token, title, idNivelCriticidad, idTipoIncidencia = 3, dataError = null) {
    try {
        let idUsuario = 0;
        try {
            if (token) {
                const dataToken = verifyAccessToken(token);
                if (dataToken) {
                    idUsuario = dataToken.idUsuario;
                }
            }
        }
        catch {};

        const data = {
            token: token??"",
            idTipoIncidencia: idTipoIncidencia,
            idNivelCriticidad: idNivelCriticidad,
            idUsuario: idUsuario,
            fecha: getDateNow(true),
            idModulo: 30,
            origen: "laramie-importacion-webapi/addIncidencia",
            mensaje: title,
            error: {
                name: err.name,
                message: err.message,
                stack: err.stack,
                parentMessage: (err.originError) ? err.originError.message : undefined,
                parentError: err.originError
            },
            data: dataError
        };
        console.log(err);
        
        const publishService = container.resolve('publishService') as PublishService;
        await publishService.sendMessage("laramie-importacion-webapi/addIncidencia", "AddIncidencia", idUsuario.toString(), data);

    }
    catch(error) {
         console.log(error);
         console.log(err);
    }
}