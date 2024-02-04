import { DataTypes, Model, Sequelize } from 'sequelize';
import Database from '../services/Database';

export default class UserModel extends Model {
	declare id: number;
	declare username: string;
}

export function UserModelInit(sequelize: Sequelize) {
	UserModel.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
				comment: 'The user their ID',
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				comment: 'The user their username',
			},
		},
		{
			sequelize,
			tableName: 'users',
			timestamps: true,
			createdAt: true,
			updatedAt: true,
		},
	);
}
