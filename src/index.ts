import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
// Routers
import * as user from './routes/UserRouter';
import * as auth from './routes/AuthRouter';
// Configuration
import configureHelmet from './configuration/helmet';
import configureCors from './configuration/cors';
import configureExpress from './configuration/express';
import configureCookieParser from './configuration/cookieParser';
import configureSession from './configuration/session';
import configurePassport from './configuration/passport';
// import configureCsrf from './configuration/csrf';
import configurePassportGoogleOauth from './configuration/passportGoogleOauth';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3000;

// Configure security
configureCors(app);
configureHelmet(app);

// Other configuration
configureExpress(app);
configureCookieParser(app);
configureSession(app);
configurePassport(app);
configurePassportGoogleOauth();
// configureCsrf(app);

// Configure routes
app.use('/users', user.default);
app.use('/auth', auth.default);

// I'm so funny
app.get('/', async (_: Request, res: Response) => {
	res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
