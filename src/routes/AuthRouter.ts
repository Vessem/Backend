import express, { Request, Response } from 'express';
import passport from 'passport';

const router = express.Router();

async function logout(req: Request, res: Response) {
	req.logout({}, () => {
		res.redirect(process.env.FRONTEND_URL ?? '/');
	});
}

// Register routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], state: 'true' }));
router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/error',
		successReturnToOrRedirect: `${process.env.FRONTEND_URL}`,
	}),
	(req, res, next) => {},
);
router.get('/logout', logout);

export default router;
