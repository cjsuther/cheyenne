import Verificacion from '../../domain/entities/verificacion';
import VerificacionService from '../../domain/services/verificacion-service';

export default class VerificacionController {

	verificacionService: VerificacionService;

	constructor(verificacionService: VerificacionService) {
		this.verificacionService = verificacionService;
	}

	get = async (req, res, next) => {
		this.verificacionService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.verificacionService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	verifyPasswordToken = async (req, res, next) => {
		const passwordToken = req.params.token
		this.verificacionService.verifyPasswordToken(passwordToken)
			.then(data => res.send(data)).catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const verificacion = new Verificacion(); verificacion.setFromObject(dataBody);
		this.verificacionService.add(verificacion)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const verificacion = new Verificacion(); verificacion.setFromObject(dataBody);
		this.verificacionService.modify(id, verificacion)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.verificacionService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
