import OrganoJudicial from '../entities/organo-judicial';
import IOrganoJudicialRepository from '../repositories/organo-judicial-repository';
import { isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class OrganoJudicialService {

	organoJudicialRepository: IOrganoJudicialRepository;

	constructor(organoJudicialRepository: IOrganoJudicialRepository) {
		this.organoJudicialRepository = organoJudicialRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.organoJudicialRepository.list();
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
				const result = await this.organoJudicialRepository.findById(id);
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

	async add(organoJudicial: OrganoJudicial) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(organoJudicial.codigoOrganoJudicial, true) ||
					!isValidString(organoJudicial.departamentoJudicial, true) ||
					!isValidString(organoJudicial.fuero, true) ||
					!isValidString(organoJudicial.secretaria, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				organoJudicial.id = null;
				const result = await this.organoJudicialRepository.add(organoJudicial);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, organoJudicial: OrganoJudicial) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(organoJudicial.codigoOrganoJudicial, true) ||
					!isValidString(organoJudicial.departamentoJudicial, true) ||
					!isValidString(organoJudicial.fuero, true) ||
					!isValidString(organoJudicial.secretaria, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.organoJudicialRepository.modify(id, organoJudicial);
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
				const result = await this.organoJudicialRepository.remove(id);
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

}
