import { OAuth2Strategy } from 'passport-google-oauth';
import passport from 'passport';
import db from '../services/Database';

export default function configurePassportGoogleOauth() {
	passport.use(
		new OAuth2Strategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID ?? '',
				clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
				callbackURL: `http://localhost:${process.env.PORT ?? 3000}/auth/google/callback`,
			},
			db.authService.verifyUser,
		),
	);
}
