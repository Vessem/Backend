import UserModel, { UserModelInit } from '../entities/UserModel';
import { Op, Sequelize } from 'sequelize';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import LIMITS from '../constants/LIMITS';

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

	/**
	 * Get users by parameters, pagination starts at 0
	 * @param level
	 * @param createdAt
	 * @param username
	 * @param options
	 */
	async getUsersByParams(
		level: number,
		createdAt: Date,
		username: string,
		options: { page: number; amount: number } = { page: 0, amount: 10 },
	): Promise<UserModel[]> {
		// Data check
		if (level < 0) return Promise.reject(new BadRequestError(`property 'level' cannot be smaller than 0`));
		if (level > 100) return Promise.reject(new BadRequestError(`property 'level' cannot be bigger than 100`));

		if (createdAt < new Date())
			return Promise.reject(new BadRequestError(`property 'createdAt' cannot be in the future`));

		if (options.page < 0) return Promise.reject(new BadRequestError(`property 'page' cannot be smaller than 0`));

		if (options.amount < 0)
			return Promise.reject(new BadRequestError(`property 'amount' cannot be smaller than 0`));
		if (options.amount > LIMITS.ENTITIES_PER_PAGE_LIMIT)
			return Promise.reject(
				new BadRequestError(`property 'amount' cannot be bigger than ${LIMITS.ENTITIES_PER_PAGE_LIMIT}`),
			);

		// Query
		const result = await UserModel.findAll({
			where: {
				username: {
					[Op.like]: `%${username}%`,
				},
				createdAt: {
					[Op.gte]: createdAt,
				},
				level: {
					[Op.gte]: level,
				},
			},
			limit: options.amount,
			offset: options.page * options.amount,
		});

		// Result check
		return Promise.resolve(result);
	}
}
