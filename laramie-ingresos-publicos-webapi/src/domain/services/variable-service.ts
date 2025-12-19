import Variable from '../entities/variable';
import IVariableRepository from '../repositories/variable-repository';
import { isValidString, isValidInteger, isValidBoolean,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import VariableCuenta from '../entities/variable-cuenta';
import VariableCuentaService from '../services/variable-cuenta-service';
import VariableGlobal from '../entities/variable-global';
import VariableGlobalService from '../services/variable-global-service';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { isNull } from '../../infraestructure/sdk/utils/validator';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';


export default class VariableService {

	variableRepository: IVariableRepository;
    variableCuentaService: VariableCuentaService;
	variableGlobalService: VariableGlobalService;

	constructor(variableRepository: IVariableRepository, 
				variableCuentaService: VariableCuentaService,
				variableGlobalService: VariableGlobalService) {
		this.variableRepository = variableRepository;
		this.variableCuentaService = variableCuentaService;
		this.variableGlobalService = variableGlobalService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.variableRepository.list() as Array<Variable>).sort((a, b) => {
					const ordenTipoTributo = (a.idTipoTributo??0) - (b.idTipoTributo??0);
					const ordenCodigo = a.codigo.localeCompare(b.codigo);
					const orden = (ordenTipoTributo !== 0) ? ordenTipoTributo : ordenCodigo;
					return orden;
				});
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByTipoTributo(idTipoTributo:number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.variableRepository.listByTipoTributo(idTipoTributo) as Array<Variable>;
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.variableRepository.findById(id);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findByCodigo(codigo: string) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.variableRepository.findByCodigo(codigo);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findVariableCuentaByCodigo(codigo:string, idCuenta:number) {
		return new Promise( async (resolve, reject) => {	
			try {
				const variablesCuenta = await this.variableCuentaService.listByCuenta(idCuenta) as Array<VariableCuenta>;

				const variable = await this.variableRepository.findByCodigo(codigo);

				let variableCuenta = variablesCuenta.find(x => x.idVariable === variable.id && 
										(x.fechaDesde <= getDateNow(false) || isNull(x.fechaDesde)) &&
										(x.fechaHasta >= getDateNow(false) || isNull(x.fechaHasta)));
				if (!variableCuenta) {
					variableCuenta = new VariableCuenta();
				}

				resolve(variableCuenta);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}			
        });
    }

    async findVariableGlobalByCodigo(codigo:string) {
		return new Promise( async (resolve, reject) => {	
			try {
				const variablesGlobales = await this.variableGlobalService.list() as Array<VariableGlobal>;

				const variable = await this.variableRepository.findByCodigo(codigo);

				let variableGlobal = variablesGlobales.find(x => x.idVariable === variable.id && 
										(x.fechaDesde <= getDateNow(false) || isNull(x.fechaDesde)) &&
										(x.fechaHasta >= getDateNow(false) || isNull(x.fechaHasta)));
				if (!variableGlobal) {
					variableGlobal = new VariableGlobal();
				}

				resolve(variableGlobal);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}			
        });
    }

	async add(variable: Variable) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(variable.codigo, true) ||
					!isValidString(variable.descripcion, true) ||
					!isValidInteger(variable.idTipoTributo, false) ||
					!isValidString(variable.tipoDato, true) ||
					!isValidBoolean(variable.constante) ||
					!isValidBoolean(variable.predefinido) ||
					!isValidBoolean(variable.opcional) ||
					!isValidBoolean(variable.activo) ||
					!isValidBoolean(variable.global)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				variable.id = null;
				if (variable.idTipoTributo === 0) variable.idTipoTributo = null;
				const result = await this.variableRepository.add(variable);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, variable: Variable) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(variable.codigo, true) ||
					!isValidString(variable.descripcion, true) ||
					!isValidInteger(variable.idTipoTributo, false) ||
					!isValidString(variable.tipoDato, true) ||
					!isValidBoolean(variable.constante) ||
					!isValidBoolean(variable.predefinido) ||
					!isValidBoolean(variable.opcional) ||
					!isValidBoolean(variable.activo) ||
					!isValidBoolean(variable.global)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}
				
				if (variable.idTipoTributo === 0) variable.idTipoTributo = null;
				const result = await this.variableRepository.modify(id, variable);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async remove(id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.variableRepository.remove(id);
				if (!result) {
					reject(new ReferenceError('No se pudo eliminar el registro, no existe o tiene dependencias'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
