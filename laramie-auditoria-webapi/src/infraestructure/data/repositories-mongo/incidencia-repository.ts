import IIncidenciaRepository from '../../../domain/repositories/incidencia-repository';
import { createIncidenciaModel } from './models/incidencia-model';
import Incidencia from '../../../domain/entities/incidencia';


export default class IncidenciaRepositoryMongo implements IIncidenciaRepository {

	constructor() {

	}

	async list() {
        const IncidenciaModel = await createIncidenciaModel();
        const data = await IncidenciaModel.find();
        const result = data.map((row) => {
            let item = new Incidencia(); item.setFromObject(row);
            return item;
        });
        
        return result;
    }

	async findById(id:Number) {
        const IncidenciaModel = await createIncidenciaModel();
        const data = await IncidenciaModel.findOne({id: id});
        const result = new Incidencia(); result.setFromObject(data);

        return result;
    }

	async add(row:Incidencia) {
        const IncidenciaModel = await createIncidenciaModel();
        const data = await IncidenciaModel.create({...row, id: Date.now()});
        const result = new Incidencia(); result.setFromObject(data);

        return result;
    }

	async modify(id:Number, row:Incidencia) {
        const IncidenciaModel = await createIncidenciaModel();
        const data = await IncidenciaModel.findOneAndUpdate({ id: id }, {...row}, {returnOriginal: false});
        let result = null;
        if (data) {result = new Incidencia(); result.setFromObject(data);}

        return result;
    }

	async remove(id:Number) {
        const IncidenciaModel = await createIncidenciaModel();
        const affected = await IncidenciaModel.deleteOne({ id: id });
        const result = (affected.deletedCount > 0) ? {id} : null;

        return result;
    }

}
