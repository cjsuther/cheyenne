import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import ProcessError from  '../../infraestructure/sdk/error/process-error';
import { ensureDirectoryExistence } from '../../infraestructure/sdk/utils/helper';
import { isNull, isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';
import config from '../configuration/config';


export default class FileController {

	constructor() {
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const path = req.params.path;
		if (!token || !isValidString(path, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const pathFile = `${config.PATH.FILES}${path}`;
		fs.readFile(pathFile, (err,data) => {
			if (err) {
				next(new ProcessError('Error leyendo archivo', err));
			}
			else {
				res.send(data);
			}
		});
	}

	getTemp = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const path = req.params.path;
		if (!token || !isValidString(path, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const pathFile = `${config.PATH.TEMP}${path}`;
		fs.readFile(pathFile, (err,data) => {
			if (err) {
				next(new ProcessError('Error leyendo archivo', err));
			}
			else {
				res.send(data);
			}
		});
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = req.body;
		if (!token || isNull(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const path = uuidv4();
		const pathFile = `${config.PATH.TEMP}${path}`;
		ensureDirectoryExistence(pathFile);
		fs.writeFile(pathFile, dataBody, (err) => {
			if (err) {
				next(new ProcessError('Error escribiendo archivo', err));
			}
			else {
				res.send(path);
			}
		});
	}

}
