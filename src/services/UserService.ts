import UserModel, { UserModelInit } from '../entities/UserModel';
import { Sequelize } from 'sequelize';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';

export default class UserService {
	constructor(sequelize: Sequelize) {
		UserModelInit(sequelize);
	}

	public async getUserById(id: number): Promise<UserModel> {
		// Data check
		if (id <= 0) return Promise.reject(new BadRequestError(`property 'id' cannot be smaller than 1`));

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
}
