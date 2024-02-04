import { Error } from 'sequelize';
import logger from '../services/Logger';

export default class BadRequestError implements Error {
	public name: string = 'Bad Request';
	public message: string;

	constructor(message: string) {
		this.message = message;
		logger.debug(`BadRequestError: ${message}`);
	}
}
