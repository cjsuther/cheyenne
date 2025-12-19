import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IPersonaFisicaRepository from '../../../domain/repositories/persona-fisica-repository';
import PersonaFisicaModel from './models/persona-fisica-model';
import PersonaFisica from '../../../domain/entities/persona-fisica';
import PersonaFilter from '../../../domain/dto/persona-filter';

export default class PersonaFisicaRepositorySequelize implements IPersonaFisicaRepository {

	constructor() {

	}

	async list() {
		const data = await PersonaFisicaModel.findAll();
		const result = data.map((row) => new PersonaFisica(...row.getDataValues()));

		return result;
	}

	async listByFilter(personaFilter: PersonaFilter) {
        const cursor = await PersonaFisicaModel.sequelize.query(
            `SELECT persona_fisica_lista(:p_numero_documento,:p_nombre,:p_etiqueta,'cursor_persona_fisica'); FETCH ALL IN "cursor_persona_fisica";`,
            {
                replacements: {
                    p_numero_documento: personaFilter.numeroDocumento,
                    p_nombre: personaFilter.nombre,
					p_etiqueta: personaFilter.etiqueta
                }
            }
        );
        const data = cursor[1][1].rows;
        
        const result = data.map((row) => {
            let item = new PersonaFisica();
            item.id = row.id;
			item.idTipoDocumento = row.id_tipo_documento;
			item.numeroDocumento = row.numero_documento;
			item.idNacionalidad = row.id_nacionalidad;
			item.nombre = row.nombre;
			item.apellido = row.apellido;
			item.idGenero = row.id_genero;
			item.idEstadoCivil = row.id_estadoCivil;
			item.idNivelEstudio = row.id_nivelEstudio;
			item.profesion = row.profesion;
			item.matricula = row.matricula;
			item.fechaNacimiento = row.fecha_nacimiento;
			item.fechaDefuncion = row.fecha_defuncion;
			item.discapacidad = row.discapacidad;
			item.idCondicionFiscal = row.id_condicion_fiscal;
			item.idIngresosBrutos = row.id_ingresos_Brutos;
			item.ganancias = row.ganancias;
			item.pin = row.pin;
			item.foto = row.foto;
            
            return item;
        });

        return result;
    }

	async findById(id:number) {
		const data = await PersonaFisicaModel.findOne({ where: { id: id } });
		const result = (data) ? new PersonaFisica(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PersonaFisica) {
		const data = await PersonaFisicaModel.create({
			idTipoDocumento: row.idTipoDocumento,
			numeroDocumento: row.numeroDocumento,
			idNacionalidad: row.idNacionalidad,
			nombre: row.nombre,
			apellido: row.apellido,
			idGenero: row.idGenero,
			idEstadoCivil: row.idEstadoCivil,
			idNivelEstudio: row.idNivelEstudio,
			profesion: row.profesion,
			matricula: row.matricula,
			fechaNacimiento: row.fechaNacimiento,
			fechaDefuncion: row.fechaDefuncion,
			discapacidad: row.discapacidad,
			idCondicionFiscal: row.idCondicionFiscal,
			idIngresosBrutos: row.idIngresosBrutos,
			ganancias: row.ganancias,
			pin: row.pin,
			foto: row.foto
		});
		const result = new PersonaFisica(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PersonaFisica) {
		const affectedCount = await PersonaFisicaModel.update({
			idTipoDocumento: row.idTipoDocumento,
			numeroDocumento: row.numeroDocumento,
			idNacionalidad: row.idNacionalidad,
			nombre: row.nombre,
			apellido: row.apellido,
			idGenero: row.idGenero,
			idEstadoCivil: row.idEstadoCivil,
			idNivelEstudio: row.idNivelEstudio,
			profesion: row.profesion,
			matricula: row.matricula,
			fechaNacimiento: row.fechaNacimiento,
			fechaDefuncion: row.fechaDefuncion,
			discapacidad: row.discapacidad,
			idCondicionFiscal: row.idCondicionFiscal,
			idIngresosBrutos: row.idIngresosBrutos,
			ganancias: row.ganancias,
			pin: row.pin,
			foto: row.foto
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PersonaFisicaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PersonaFisica(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PersonaFisicaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await PersonaFisicaModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
