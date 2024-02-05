import UserModel, { UserModelInit } from '../entities/UserModel';
import { Op, Sequelize } from 'sequelize';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';

export default class UserService {
	constructor(sequelize: Sequelize) {
		UserModelInit(sequelize);
	}

	public async getUserById(id: number): Promise<UserModel> {
		// Data check
		if (id < 1) return Promise.reject(new BadRequestError(`property 'id' cannot be smaller than 1`));

		// Query
		const result = await UserModel.findOne({
			where: {
				id,
			},
		});

		// Result check
		if (!result) return Promise.reject(new NotFoundError(`user with property 'id' of ${id} was not found`));
		return Promise.resolve(result);
	}

	async getUsersByParams(body: { level: number; createdAt: Date; username: string }): Promise<UserModel[]> {
		// Data check
		if (body.level < 0) return Promise.reject(new BadRequestError(`property 'level' cannot be smaller than 0`));
		if (body.level > 100) return Promise.reject(new BadRequestError(`property 'level' cannot be bigger than 100`));
		if (body.createdAt < new Date())
			return Promise.reject(new BadRequestError(`property 'createdAt' cannot be in the future`));

		// Query
		const result = await UserModel.findAll({
			where: {
				username: {
					[Op.like]: `%${body.username}%`,
				},
				createdAt: {
					[Op.gte]: body.createdAt,
				},
				level: {
					[Op.gte]: body.level,
				},
			},
		});

		// Result check
		return Promise.resolve(result);
	}

	async createNewUser(body: {
		password: string | undefined;
		email: string | undefined;
		username: string | undefined;
	}): Promise<UserModel> {
		// Data check
		if (!body.password) return Promise.reject(new BadRequestError(`property 'password' is a required field`));
		if (!body.email) return Promise.reject(new BadRequestError(`property 'email' is a required field`));
		if (!body.username) return Promise.reject(new BadRequestError(`property 'username' is a required field`));

		// Query
		const result = await UserModel.create({
			username: body.username,
			email: body.email,
			password: body.email,
			salt: 'TEST_SALT',
		});

		// Result check
		return Promise.resolve(result);
	}
}
