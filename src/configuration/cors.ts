import { Express } from 'express';
import cors from 'cors';

export default function configureCors(app: Express) {
	app.use(
		cors({
			origin: '*',
			optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
		}),
	);
}
