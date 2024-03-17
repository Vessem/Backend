import express, { Request, Response } from 'express';
import passport from 'passport';

const router = express.Router();

async function logout(req: Request, res: Response) {
	req.logout({}, () => {
		res.redirect(`${process.env.FRONTEND_URL}/logout` ?? '/');
	});
}

// Register routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], state: 'true' }));
router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/error',
		successReturnToOrRedirect: `${process.env.FRONTEND_URL}/success`,
	}),
	(req, res, next) => {},
);
router.get('/logout', logout);

export default router;
