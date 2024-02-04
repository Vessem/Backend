import logger from '../services/Logger';

export default class NotFoundError implements Error {
	public name: string = 'Not Found';
	public message: string;

	constructor(message: string) {
		this.message = message;

		logger.debug(`NotFoundError: ${message}`);
	}
}
