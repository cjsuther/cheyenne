import IListaRepository from '../../../domain/repositories/lista-repository';
import ListaModel from './models/lista-model';
import Lista from '../../../domain/entities/lista';
import PersonaJuridicaRubroAfipModel from './models/persona-juridica-rubro-afip-model';
import ListaState from '../../../domain/dto/lista-state';


export default class ListaRepositorySequelize implements IListaRepository {

    constructor() {

    }

    async list(tipo:string) {
        const data = await ListaModel.findAll({ where: { tipo: tipo } });
        const result = data.map((row) => new Lista(...row.getDataValues()));

        return result;
    }

	async listRubroAfipByPersonaJuridica(idPersonaJuridica:number) {
        const data = await ListaModel.findAll(
            {
                include: 
                [{
                    model: PersonaJuridicaRubroAfipModel,
                    required: true,
                    as: 'personaJuridicaRubroAfip',
                    where: { idPersonaJuridica: idPersonaJuridica }
                }]
            }
        );
        const result = data.map((row) => new ListaState(...row.getDataValues()));

        return result;
    }

}
