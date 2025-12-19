import IReciboPublicacionLoteRepository from '../../../domain/repositories/recibo-publicacion-lote-repository';
import { createReciboPublicacionLoteModel } from './models/recibo-publicacion-lote-model';
import ReciboPublicacionLote from '../../../domain/entities/recibo-publicacion-lote';

export default class ReciboPublicacionLoteRepositoryMongo implements IReciboPublicacionLoteRepository {

	constructor() {

	}

	async listPendienteEnvio() {
        const ReciboPublicacionLoteModel = await createReciboPublicacionLoteModel();
        const data = await ReciboPublicacionLoteModel.find({fechaEnvio: null});
        const result = data.map((row) => {
            let item = new ReciboPublicacionLote(); item.setFromObject(row);
            return item;
        });
        
        return result;
    }

	async findByLote(numeroLotePublicacion:string) {
        const ReciboPublicacionLoteModel = await createReciboPublicacionLoteModel();
        const data = await ReciboPublicacionLoteModel.findOne({numeroLotePublicacion: numeroLotePublicacion});
        let result = null;
        if (data) {
            result = new ReciboPublicacionLote();
            result.setFromObject(data);
        }

        return result;
    }

	async add(row:ReciboPublicacionLote) {
        const ReciboPublicacionLoteModel = await createReciboPublicacionLoteModel();
        const data = await ReciboPublicacionLoteModel.create({...row});
        const result = new ReciboPublicacionLote(); result.setFromObject(data);

        return result;
    }

	async modify(numeroLotePublicacion:string, fechaEnvio:Date, fechaConfirmacion:Date, observacionEnvio:string, observacionConfirmacion:string) {
        const ReciboPublicacionLoteModel = await createReciboPublicacionLoteModel();
        const data = await ReciboPublicacionLoteModel.findOneAndUpdate({numeroLotePublicacion: numeroLotePublicacion}, {fechaEnvio: fechaEnvio, fechaConfirmacion: fechaConfirmacion, observacionEnvio: observacionEnvio, observacionConfirmacion: observacionConfirmacion}, {returnOriginal: false});
        let result = null;
        if (data) {result = new ReciboPublicacionLote(); result.setFromObject(data);}

        return result;
    }

    async modifyEnvio(numeroLotePublicacion:string, fechaEnvio:Date, observacionEnvio:string) {
        const ReciboPublicacionLoteModel = await createReciboPublicacionLoteModel();
        const data = await ReciboPublicacionLoteModel.findOneAndUpdate(
            {numeroLotePublicacion: numeroLotePublicacion, fechaEnvio: null},
            {fechaEnvio: fechaEnvio, observacionEnvio: observacionEnvio},
            {returnOriginal: false}
        );
        let result = null;
        if (data) {result = new ReciboPublicacionLote(); result.setFromObject(data);}

        return result;
    }

    async modifyConfirmacion(numeroLotePublicacion:string, fechaConfirmacion:Date, observacionConfirmacion:string) {
        const ReciboPublicacionLoteModel = await createReciboPublicacionLoteModel();
        const data = await ReciboPublicacionLoteModel.findOneAndUpdate(
            {numeroLotePublicacion: numeroLotePublicacion, fechaConfirmacion: null},
            {fechaConfirmacion: fechaConfirmacion, observacionConfirmacion: observacionConfirmacion},
            {returnOriginal: false}
        );
        let result = null;
        if (data) {result = new ReciboPublicacionLote(); result.setFromObject(data);}

        return result;
    }

    async modifyError(numeroLotePublicacion:string, observacion:string) {
        const ReciboPublicacionLoteModel = await createReciboPublicacionLoteModel();
        const data = await ReciboPublicacionLoteModel.findOneAndUpdate({numeroLotePublicacion: numeroLotePublicacion}, {error: true, observacionConfirmacion: observacion}, {returnOriginal: false});
        let result = null;
        if (data) {result = new ReciboPublicacionLote(); result.setFromObject(data);}

        return result;
    }

}
