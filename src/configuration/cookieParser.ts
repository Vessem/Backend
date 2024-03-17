import { Express } from 'express';
import cookieParser from 'cookie-parser';

export default function configureCookieParser(app: Express) {
	app.use(cookieParser(process.env.COOKIE_SECRET));
}
