import { Express } from 'express';
import csrf from 'csurf';

export default function configureCsrf(app: Express) {
	app.use(csrf());
	app.use(function (req, res, next) {
		const token = req.csrfToken();
		res.cookie('XSRF-TOKEN', token);
		res.locals.csrfToken = token;
		next();
	});
}
