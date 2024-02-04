import { Sequelize } from 'sequelize';
import UserService from './UserService';
import logger from './Logger';

export class Database {
	public connected: boolean = false;
	private readonly sequelize: Sequelize;
	public userService: UserService;

	constructor() {
		// Create database connection
		this.sequelize = new Sequelize(
			process.env.MYSQL_DATABASE || 'vessem',
			process.env.MYSQL_USERNAME || 'root',
			process.env.MYSQL_PASSWORD || 'testpassword',
			{
				host: 'localhost',
				port: 3306,
				dialect: 'mysql',
				logging: (msg) => logger.debug(msg),
			},
		);

		// Setup all services and models
		this.userService = new UserService(this.sequelize);

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
			return Promise.reject(e);
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
			return Promise.reject(e);
		}
	}

	async close(): Promise<Error | void> {
		if (!this.connected) return Promise.resolve();

		this.connected = false;
		try {
			await this.sequelize.close();
			return Promise.resolve();
		} catch (e) {
			return Promise.reject(e);
		}
	}
}

const db = new Database();
export default db;
