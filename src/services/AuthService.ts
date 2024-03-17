import { Sequelize } from 'sequelize';
import AuthModel, { AuthModelInit } from '../models/AuthModel';
import { Profile, VerifyFunction } from 'passport-google-oauth';
import UserModel from '../entities/UserModel';
import PROVIDER from '../constants/PROVIDER';

export default class AuthService {
	constructor(sequelize: Sequelize) {
		AuthModelInit(sequelize);
	}

	async verifyUser(accessToken: string, refreshToken: string, profile: Profile, done: VerifyFunction) {
		// Data check
		let user: UserModel;

		// Query
		const auth = await AuthModel.findOne({
			where: {
				provider: String(PROVIDER.google),
				subject: profile.id,
			},
		});

		if (!auth) {
			// New user
			user = await UserModel.create({
				username: profile.username ?? profile.displayName,
				email: profile.emails ? profile.emails[0].value : undefined,
			});

			// Save auth
			await AuthModel.create({
				provider: String(PROVIDER.google),
				userId: user.id,
				subject: profile.id,
			});
		} else {
			// Existing user
			const userModel = await UserModel.findOne({
				where: {
					id: auth.userId,
				},
			});

			if (!userModel) {
				done('User not found');
				return;
			}

			user = userModel;
		}

		// Result check
		done(null, user);
	}

	isLoggedIn = (req: any, res: any, next: any) => {
		if (req.user) {
			next();
		} else {
			res.sendStatus(401);
		}
	};
}
