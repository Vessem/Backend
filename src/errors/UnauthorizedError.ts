import { Error } from 'sequelize';
import logger from '../services/Logger';

export default class UnauthorizedError implements Error {
	public name: string = 'Unauthorized';
	public message: string;

	constructor(message: string) {
		this.message = message;
		logger.debug(`UnauthorizedError: ${message}`);
	}
}
