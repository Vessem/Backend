import { Express } from 'express';
import session from 'express-session';

export default function configureSession(app: Express) {
	app.use(session({ secret: process.env.COOKIE_SECRET ?? 'SECRET', saveUninitialized: true, resave: false }));
}
