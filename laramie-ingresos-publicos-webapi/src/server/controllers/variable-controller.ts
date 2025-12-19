import Variable from '../../domain/entities/variable';
import VariableService from '../../domain/services/variable-service';

export default class VariableController {

	variableService: VariableService;

	constructor(variableService: VariableService) {
		this.variableService = variableService;
	}

	get = (req, res, next) => {
		this.variableService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.variableService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	getVariableCuentaByCodigo = async (req, res, next) => {
		const codigo = req.params.codigo;
		const idCuenta = req.params.idCuenta;
		this.variableService.findVariableCuentaByCodigo(codigo, idCuenta)
			.then(row => res.send(row))
			.catch(next)
	}

	getVariableGlobalByCodigo = async (req, res, next) => {
		const codigo = req.params.codigo;
		this.variableService.findVariableGlobalByCodigo(codigo)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const variable = new Variable(); variable.setFromObject(dataBody);
		this.variableService.add(variable)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const variable = new Variable(); variable.setFromObject(dataBody);
		this.variableService.modify(id, variable)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.variableService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
