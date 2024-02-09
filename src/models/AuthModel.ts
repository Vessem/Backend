import { DataTypes, Model, Sequelize } from 'sequelize';
import _ from 'lodash';
import PROVIDER from '../constants/PROVIDER';

export default class AuthModel extends Model {
	declare id: number;
	declare provider: PROVIDER;
	declare userId: number;
	declare subject: string;
	declare createdAt: Date;
}

// List of field names to exclude from the json
const jsonExclude = ['id', 'provider', 'userId', 'subject'];

export function AuthModelInit(sequelize: Sequelize) {
	AuthModel.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
				comment: 'The auth ID',
			},
			provider: {
				type: DataTypes.ENUM(...Object.keys(PROVIDER)),
				allowNull: false,
				comment: 'The provider used the gain the token',
			},
			userId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				comment: 'The users id',
			},
			subject: {
				type: DataTypes.STRING,
				allowNull: false,
				comment: 'The auth token',
			},
		},
		{
			sequelize,
			tableName: 'auth',
			timestamps: true,
			createdAt: true,
		},
	);

	AuthModel.prototype.toJSON = function () {
		// Taken from original function
		let data = _.cloneDeep(
			this.get({
				plain: true,
			}),
		);

		// Remove excluded fields from object
		jsonExclude.forEach((field) => {
			delete data[field];
		});

		return data;
	};
}
