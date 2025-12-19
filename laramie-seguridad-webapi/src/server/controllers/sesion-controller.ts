import Sesion from '../../domain/entities/sesion';
import SesionService from '../../domain/services/sesion-service';

export default class SesionController {

	sesionService: SesionService;

	constructor(sesionService: SesionService) {
		this.sesionService = sesionService;
	}

	getByToken = async (req, res, next) => {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		this.sesionService.findByToken(token)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		const sesion = new Sesion();
		sesion.token = token;
		this.sesionService.add(sesion)
			.then(row => res.send(row))
			.catch(next)
	}

	expirateSesion = async (req, res, next) => {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		this.sesionService.expirateSesion(token)
			.then(row => res.send(row))
			.catch(next)
	}

}
