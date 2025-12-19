import VariableCuenta from '../entities/variable-cuenta';
import VariableCuentaState from '../dto/variable-cuenta-state';
import IVariableCuentaRepository from '../repositories/variable-cuenta-repository';
import { isValidInteger, isValidString, isValidDate, isValidBoolean, isNull } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class VariableCuentaService {

	variableCuentaRepository: IVariableCuentaRepository;

	constructor(variableCuentaRepository: IVariableCuentaRepository) {
		this.variableCuentaRepository = variableCuentaRepository;
	}

	async listByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				//ordenado de mayor a menor
				const result = (await this.variableCuentaRepository.listByCuenta(idCuenta) as Array<VariableCuentaState>)
									.sort((a, b) => (b.fechaDesde < a.fechaDesde) ? -1 : (b.fechaDesde < a.fechaDesde) ? 1 : 0);
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
				const result = await this.variableCuentaRepository.findById(id);
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

	async add(variableCuenta: VariableCuenta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(variableCuenta.idVariable, true) ||
					!isValidInteger(variableCuenta.idCuenta, true) ||
					!isValidString(variableCuenta.valor, true) ||
					!isValidDate(variableCuenta.fechaDesde, false) ||
					!isValidDate(variableCuenta.fechaHasta, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				variableCuenta.id = null;
				const result = await this.variableCuentaRepository.add(variableCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, variableCuenta: VariableCuenta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(variableCuenta.idVariable, true) ||
					!isValidInteger(variableCuenta.idCuenta, true) ||
					!isValidString(variableCuenta.valor, true) ||
					!isValidDate(variableCuenta.fechaDesde, false) ||
					!isValidDate(variableCuenta.fechaHasta, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.variableCuentaRepository.modify(id, variableCuenta);
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
				const result = await this.variableCuentaRepository.remove(id);
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

	async removeByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.variableCuentaRepository.removeByCuenta(idCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	validateDateRange(variablesCuenta: Array<VariableCuentaState>) {
		const variablesId = [...new Set(variablesCuenta.map(x => x.idVariable))]; //quito duplicados
		for (let i=0; i < variablesId.length; i++) {
			const idVariable = variablesId[i];
			const variablesCuentaXVariable = variablesCuenta.filter(f => f.state !== 'r' && f.idVariable === idVariable);
			//valido todas los rangos entre todos, pero evito repetir validaciones con col_offset
			let col_offset = 0;
			for (let row=0; row < variablesCuentaXVariable.length; row++) {
				for (let col=col_offset; col < variablesCuentaXVariable.length; col++) {
					const var1 = variablesCuentaXVariable[row];
					const var2 = variablesCuentaXVariable[col];
					if (var1.id !== var2.id) {
						const confilct = (var1.fechaDesde <= var2.fechaHasta || isNull(var1.fechaDesde) || isNull(var2.fechaHasta)) &&
											(var1.fechaHasta >= var2.fechaDesde || isNull(var1.fechaHasta) || isNull(var2.fechaDesde));
						if (confilct) return false;
					}
				}
				col_offset++;
			}
		}
        return true;
    }

}
