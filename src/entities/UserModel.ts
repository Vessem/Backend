import { DataTypes, Model, Sequelize } from 'sequelize';
import _ from 'lodash';

export default class UserModel extends Model {
	declare id: number;
	declare username: string;
	declare email?: string;
	declare level: number;
	declare createdAt: Date;
	declare updatedAt: Date;
}

// List of field names to exclude from the json
const jsonExclude = ['email'];

export function UserModelInit(sequelize: Sequelize) {
	UserModel.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
				comment: 'The users ID',
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				comment: 'The users username',
			},
			email: {
				type: DataTypes.STRING,
				allowNull: true,
				comment: 'The users email',
			},
			level: {
				type: DataTypes.TINYINT,
				allowNull: false,
				comment: 'The users level',
				defaultValue: 0,
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

	UserModel.prototype.toJSON = function () {
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
