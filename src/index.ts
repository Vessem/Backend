import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
// import csrf from 'csurf';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
// Routers
import * as user from './routes/UserRouter';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Configure security
app.use(
	cors({
		origin: '*',
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	}),
);
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.frameguard());
app.use(helmet.hsts({ maxAge: 7776000000, includeSubDomains: true }));
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());

// Other configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({ secret: process.env.COOKIE_SECRET || 'SECRET', saveUninitialized: true, resave: true }));
//app.use(csrf());

// Add csrf token to requests
// app.use(function (req, res, next) {
// 	const token = req.csrfToken();
// 	res.cookie('XSRF-TOKEN', token);
// 	res.locals.csrfToken = token;
// 	next();
// });

// Configure routes
app.use('/users', user.default);

// I'm so funny
app.get('/', async (_: Request, res: Response) => {
	res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
