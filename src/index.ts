import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import cors from 'cors';
import helmet from 'helmet';
// Routers
import * as user from './routes/UserRouter';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Configure api
app.use(
	cors({
		origin: '*',
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	}),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(csrf({ cookie: true }));
app.use(helmet());
app.disable('x-powered-by');

// Configure routes
app.use('/users', user.default);

// I'm so funny
app.get('/', async (_: Request, res: Response) => {
	res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
