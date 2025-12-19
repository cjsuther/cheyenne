import ReciboEspecialDTO from '../../domain/dto/recibo-especial-dto';
import ReciboEspecial from '../../domain/entities/recibo-especial';
import ReciboEspecialService from '../../domain/services/recibo-especial-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class ReciboEspecialController {

	reciboEspecialService: ReciboEspecialService;

	constructor(reciboEspecialService: ReciboEspecialService) {
		this.reciboEspecialService = reciboEspecialService;
	}

	get = async (req, res, next) => {
		this.reciboEspecialService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.reciboEspecialService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new UnauthorizedError('Token inválido'));
			return;
		}
		const dataToken = verifyAccessToken(token);
		if (!dataToken) {
			next(new UnauthorizedError('No se pudo obtener información del Token'));
			return;
		}

		const dataBody = {...req.body};
		const reciboEspecialDTO = new ReciboEspecialDTO(); reciboEspecialDTO.setFromObject(dataBody);
		this.reciboEspecialService.add(reciboEspecialDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new UnauthorizedError('Token inválido'));
			return;
		}
		const dataToken = verifyAccessToken(token);
		if (!dataToken) {
			next(new UnauthorizedError('No se pudo obtener información del Token'));
			return;
		}

		const id = req.params.id;
		const dataBody = {...req.body};
		const reciboEspecialDTO = new ReciboEspecialDTO(); reciboEspecialDTO.setFromObject(dataBody);
		this.reciboEspecialService.modify(id, reciboEspecialDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.reciboEspecialService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
