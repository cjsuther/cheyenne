import VariableGlobal from '../../domain/entities/variable-global';
import VariableGlobalService from '../../domain/services/variable-global-service';

export default class VariableGlobalController {

	variableGlobalService: VariableGlobalService;

	constructor(variableGlobalService: VariableGlobalService) {
		this.variableGlobalService = variableGlobalService;
	}

	get = async (req, res, next) => {
		this.variableGlobalService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.variableGlobalService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const variableGlobal = new VariableGlobal();
		variableGlobal.setFromObject(dataBody);
		this.variableGlobalService.add(variableGlobal)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const variableGlobal = new VariableGlobal();
		variableGlobal.setFromObject(dataBody);
		this.variableGlobalService.modify(id, variableGlobal)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.variableGlobalService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
