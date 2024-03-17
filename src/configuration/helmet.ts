import { Express } from 'express';
import helmet from 'helmet';

export default function configureHelmet(app: Express) {
	app.use(helmet());
	app.use(helmet.xssFilter());
	app.use(helmet.frameguard());
	app.use(helmet.hsts({ maxAge: 7776000000, includeSubDomains: true }));
	app.use(helmet.hidePoweredBy());
	app.use(helmet.ieNoOpen());
	app.use(helmet.noSniff());
}
