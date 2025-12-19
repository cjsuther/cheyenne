import IPagoRendicionLoteRepository from '../../../domain/repositories/pago-rendicion-lote-repository';
import { createPagoRendicionLoteModel } from './models/pago-rendicion-lote-model';
import PagoRendicionLote from '../../../domain/entities/pago-rendicion-lote';
import { error } from 'console';

export default class PagoRendicionLoteRepositoryMongo implements IPagoRendicionLoteRepository {

	constructor() {

	}

	async listPendienteEnvio() {
        const PagoRendicionLoteModel = await createPagoRendicionLoteModel();
        const data = await PagoRendicionLoteModel.find({fechaEnvio: null});
        const result = data.map((row) => {
            let item = new PagoRendicionLote(); item.setFromObject(row);
            return item;
        });
        
        return result;
    }

	async findByLote(numeroLoteRendicion:string) {
        const PagoRendicionLoteModel = await createPagoRendicionLoteModel();
        const data = await PagoRendicionLoteModel.findOne({numeroLoteRendicion: numeroLoteRendicion});
        let result = null;
        if (data) {
            result = new PagoRendicionLote();
            result.setFromObject(data);
        }

        return result;
    }

	async add(row:PagoRendicionLote) {
        const PagoRendicionLoteModel = await createPagoRendicionLoteModel();
        const data = await PagoRendicionLoteModel.create({...row});
        const result = new PagoRendicionLote(); result.setFromObject(data);

        return result;
    }

	async modify(numeroLoteRendicion:string, fechaEnvio:Date, fechaConfirmacion:Date, observacionEnvio:string, observacionConfirmacion:string) {
        const PagoRendicionLoteModel = await createPagoRendicionLoteModel();
        const data = await PagoRendicionLoteModel.findOneAndUpdate({numeroLoteRendicion: numeroLoteRendicion}, {fechaEnvio: fechaEnvio, fechaConfirmacion: fechaConfirmacion, observacionEnvio: observacionEnvio, observacionConfirmacion: observacionConfirmacion}, {returnOriginal: false});
        let result = null;
        if (data) {result = new PagoRendicionLote(); result.setFromObject(data);}

        return result;
    }

    async modifyEnvio(numeroLoteRendicion:string, fechaEnvio:Date, observacionEnvio:string) {
        const PagoRendicionLoteModel = await createPagoRendicionLoteModel();
        const data = await PagoRendicionLoteModel.findOneAndUpdate(
            {numeroLoteRendicion: numeroLoteRendicion, fechaEnvio: null},
            {fechaEnvio: fechaEnvio, observacionEnvio: observacionEnvio},
            {returnOriginal: false}
        );
        let result = null;
        if (data) {result = new PagoRendicionLote(); result.setFromObject(data);}

        return result;
    }

    async modifyConfirmacion(numeroLoteRendicion:string, fechaConfirmacion:Date, observacionConfirmacion:string) {
        const PagoRendicionLoteModel = await createPagoRendicionLoteModel();
        const data = await PagoRendicionLoteModel.findOneAndUpdate(
            {numeroLoteRendicion: numeroLoteRendicion, fechaConfirmacion: null},
            {fechaConfirmacion: fechaConfirmacion, observacionConfirmacion: observacionConfirmacion},
            {returnOriginal: false}
        );
        let result = null;
        if (data) {result = new PagoRendicionLote(); result.setFromObject(data);}

        return result;
    }

    async modifyError(numeroLoteRendicion:string, observacion:string) {
        const PagoRendicionLoteModel = await createPagoRendicionLoteModel();
        const data = await PagoRendicionLoteModel.findOneAndUpdate({numeroLoteRendicion: numeroLoteRendicion}, {error: true, observacionConfirmacion: observacion}, {returnOriginal: false});
        let result = null;
        if (data) {result = new PagoRendicionLote(); result.setFromObject(data);}

        return result;
    }

}
