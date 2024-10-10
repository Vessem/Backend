import { Sequelize } from 'sequelize';
import UserService from './UserService';
import logger from './Logger';
import dotenv from 'dotenv';
import AuthService from './AuthService';
import { toNumber } from 'lodash';

export class Database {
	public connected: boolean = false;
	public userService: UserService;
	public authService: AuthService;
	private readonly sequelize: Sequelize;

	constructor() {
		// Load env
		dotenv.config();

		// Create database connection
		this.sequelize = new Sequelize(
			(process.env.MYSQL_DATABASE as string) ?? '',
			(process.env.MYSQL_USERNAME as string) ?? 'root',
			(process.env.MYSQL_PASSWORD as string) ?? '',
			{
				host: (process.env.MYSQL_HOST as string) ?? 'localhost',
				port: toNumber(process.env.MYSQL_PORT) ?? 3306,
				dialect: 'mysql',
				logging: (msg) => logger.debug(msg),
			},
		);

		// Setup all services and models
		this.userService = new UserService(this.sequelize);
		this.authService = new AuthService(this.sequelize);

		// Connect to database
		this.sequelize
			.authenticate()
			.then(() => {
				logger.info('Connected to DB');

				// Sync models with tables
				this.sequelize
					.sync({ alter: true })
					.then(() => {
						logger.info('Synced models with DB');
					})
					.catch((error) => {
						logger.error(`Failed to sync tables with DB:\n${error}`);
					});
			})
			.catch((error) => {
				logger.error(`Failed to connect to DB:\n${error}`);
			});
	}

	async sync(): Promise<Error | void> {
		try {
			await this.sequelize.sync({ alter: true });
			return Promise.resolve();
		} catch (e) {
			return Promise.reject(e as Error);
		}
	}

	async connect(): Promise<Error | void> {
		if (this.connected) return Promise.resolve();

		try {
			await this.sequelize.authenticate();
			this.connected = true;
			return Promise.resolve();
		} catch (e) {
			this.connected = false;
			return Promise.reject(e as Error);
		}
	}

	async close(): Promise<Error | void> {
		if (!this.connected) return Promise.resolve();

		this.connected = false;
		try {
			await this.sequelize.close();
			return Promise.resolve();
		} catch (e) {
			return Promise.reject(e as Error);
		}
	}
}

const db = new Database();
export default db;
