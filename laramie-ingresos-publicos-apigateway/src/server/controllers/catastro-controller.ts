import CatastroService from '../../domain/services/catastro-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject, isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class CatastroController {

	catastroService: CatastroService;

	constructor(catastroService: CatastroService) {
		this.catastroService = catastroService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.catastroService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return; 
		}
		
		this.catastroService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	getByPartida = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const partida = req.params.partida;
		if (!token || !isValidString(partida, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.catastroService.findByPartida(token, partida)
			.then(row => res.send(row))
			.catch(next)
	}

	getByNomenclatura = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const circunscripcion = req.query.circunscripcion;
		const seccion = req.query.seccion;
		const chacra = req.query.chacra;
		const letraChacra = req.query.letraChacra;
		const quinta = req.query.quinta;
		const letraQuinta = req.query.letraQuinta;
		const fraccion = req.query.fraccion;
		const letraFraccion = req.query.letraFraccion;
		const manzana = req.query.manzana;
		const letraManzana = req.query.letraManzana;
		const parcela = req.query.parcela;
		const letraParcela = req.query.letraParcela;
		const subparcela = req.query.subparcela;
		
		this.catastroService.findByNomenclatura(token, circunscripcion, seccion, chacra, letraChacra, quinta, letraQuinta, fraccion, letraFraccion, manzana, letraManzana, parcela, letraParcela, subparcela)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.catastroService.add(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.catastroService.modify(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.catastroService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
