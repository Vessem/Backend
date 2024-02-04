import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
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

// Configure routes
app.use('/users', user.default);

// I'm so funny
app.get('/', async (_: Request, res: Response) => {
	res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
