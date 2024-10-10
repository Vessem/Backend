import express, { Request, Response } from 'express';
import db from '../services/Database';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import logger from '../services/Logger';
import LIMITS from '../constants/LIMITS';
import { constants as status } from 'node:http2';

const router = express.Router();

/**
 * Get user by ID
 * @param req
 * @param res
 */
async function getUserById(req: Request<{ id: number }>, res: Response) {
	try {
		const user = await db.userService.getUserById(req.params.id);
		res.status(status.HTTP_STATUS_OK).type('application/json').send(user);
	} catch (e) {
		if (e instanceof BadRequestError) res.sendStatus(status.HTTP_STATUS_BAD_REQUEST);
		else if (e instanceof NotFoundError) res.sendStatus(status.HTTP_STATUS_NOT_FOUND);
		else {
			logger.error(e);
			res.sendStatus(status.HTTP_STATUS_INTERNAL_SERVER_ERROR);
		}
	}
}

async function getUsersByParams(
	req: Request<
		{},
		{},
		{ level: number; username: string; createdAt: Date },
		{ page: number | undefined; amount: number | undefined }
	>,
	res: Response,
) {
	try {
		// Get users
		const user = await db.userService.getUsersByParams(
			req.body.level || 0,
			req.body?.createdAt || '',
			req.body?.username || '',
			{
				page: req.query.page || 0,
				amount: Number(req.query.amount) || LIMITS.ENTITIES_PER_PAGE_LIMIT, // req.query.amount is a string for some reason???
			},
		);

		res.status(status.HTTP_STATUS_OK).type('application/json').send(user);
	} catch (e) {
		if (e instanceof BadRequestError) res.sendStatus(status.HTTP_STATUS_BAD_REQUEST);
		else {
			logger.error(e);
			res.sendStatus(status.HTTP_STATUS_INTERNAL_SERVER_ERROR);
		}
	}
}

async function getCurrentUser(req: Request, res: Response) {
	try {
		if (!req.user) {
			res.sendStatus(status.HTTP_STATUS_UNAUTHORIZED);
			return;
		}
		// @ts-expect-error req.user.id is valid
		const user = await db.userService.getUserById(req.user.id);
		res.status(status.HTTP_STATUS_OK).type('application/json').send(user);
	} catch (e) {
		if (e instanceof BadRequestError) res.sendStatus(status.HTTP_STATUS_BAD_REQUEST);
		else if (e instanceof NotFoundError) res.sendStatus(status.HTTP_STATUS_NOT_FOUND);
		else {
			logger.error(e);
			res.sendStatus(status.HTTP_STATUS_INTERNAL_SERVER_ERROR);
		}
	}
}

// Register routes
router.get('/current', db.authService.isLoggedIn, getCurrentUser);
router.get('/:id', getUserById);
router.post('/query', getUsersByParams);

export default router;
