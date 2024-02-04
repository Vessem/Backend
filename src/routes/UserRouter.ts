import express, { Request, Response } from 'express';
import db from '../services/Database';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import logger from '../services/Logger';

const router = express.Router();

router.get('/:id', async (req: Request<{ id: number }>, res: Response) => {
	try {
		const user = await db.userService.getUserById(req.params.id);
		res.status(200).send(user);
	} catch (e) {
		if (e instanceof BadRequestError) res.sendStatus(400);
		else if (e instanceof NotFoundError) res.sendStatus(404);
		else {
			logger.error(e);
			res.sendStatus(500);
		}
	}
});

export default router;
