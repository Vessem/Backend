import express, { Request, Response } from 'express';
import db from '../services/Database';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import logger from '../services/Logger';
import HTTP_STATUS from '../constants/HTTP_STATUS';
import { authorize } from 'passport';
import UnauthorizedError from '../errors/UnauthorizedError';

const router = express.Router();

/**
 * Get user by ID
 * @param req
 * @param res
 */
async function getUserById(req: Request<{ id: number }>, res: Response) {
	try {
		const user = await db.userService.getUserById(req.params.id);
		res.status(HTTP_STATUS.OK).type('application/json').send(user);
	} catch (e) {
		if (e instanceof BadRequestError) res.sendStatus(HTTP_STATUS.BAD_REQUEST);
		else if (e instanceof NotFoundError) res.sendStatus(HTTP_STATUS.NOT_FOUND);
		else {
			logger.error(e);
			res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
		}
	}
}

async function getUsersByParams(req: Request, res: Response) {
	try {
		// Get users
		const user = await db.userService.getUsersByParams({
			username: req.body?.username || '',
			level: req.body?.level || '',
			createdAt: req.body?.createdAt || '',
		});

		res.status(HTTP_STATUS.OK).type('application/json').send(user);
	} catch (e) {
		if (e instanceof BadRequestError) res.sendStatus(HTTP_STATUS.BAD_REQUEST);
		else {
			logger.error(e);
			res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
		}
	}
}

async function getCurrentUser(req: Request, res: Response) {
	try {
		if (!req.user) {
			res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
			return;
		}
		// @ts-expect-error req.user.id is valid
		const user = await db.userService.getUserById(req.user.id);
		res.status(HTTP_STATUS.OK).type('application/json').send(user);
	} catch (e) {
		if (e instanceof BadRequestError) res.sendStatus(HTTP_STATUS.BAD_REQUEST);
		else if (e instanceof NotFoundError) res.sendStatus(HTTP_STATUS.NOT_FOUND);
		else {
			logger.error(e);
			res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
		}
	}
}

// Register routes
router.get('/current', db.authService.isLoggedIn, getCurrentUser);
router.get('/:id', getUserById);
router.post('/query', getUsersByParams);

export default router;
