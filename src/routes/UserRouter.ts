import express, { Request, Response } from 'express';
import db from '../services/Database';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import logger from '../services/Logger';
import HTTP_STATUS from '../constants/HTTP_STATUS';
import LIMITS from '../constants/LIMITS';
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

		res.status(HTTP_STATUS.OK).type('application/json').send(user);
	} catch (e) {
		if (e instanceof BadRequestError) res.sendStatus(HTTP_STATUS.BAD_REQUEST);
		else {
			logger.error(e);
			res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
		}
	}
}

async function createNewUser(req: Request, res: Response) {
	try {
		const user = await db.userService.createNewUser({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
		});
		res.status(HTTP_STATUS.CREATED).type('application/json').send(user);
	} catch (e) {
		if (e instanceof BadRequestError) res.sendStatus(HTTP_STATUS.BAD_REQUEST);
		else {
			logger.error(e);
			res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
		}
	}
}

// Register routes
router.get('/:id', getUserById);
router.post('/query', getUsersByParams);
router.post('/', createNewUser);

export default router;
