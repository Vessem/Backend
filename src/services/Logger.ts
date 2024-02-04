import winston from 'winston';

const logger = winston.createLogger({
	level: process.env.LOGGING_LEVEL || 'debug',
	format: winston.format.simple(),
	transports: [
		new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
		new winston.transports.File({ filename: './logs/full.log' }),
	],
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		}),
	);
}

export default logger;
