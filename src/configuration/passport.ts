import passport from 'passport';
import { Express } from 'express';

export default function configurePassport(app: Express) {
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((user, callback) => {
		callback(null, user);
	});
	passport.deserializeUser((obj: false | Express.User | null | undefined, callback) => {
		callback(null, obj);
	});
}
