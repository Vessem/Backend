import express, { Express } from 'express';

export default function configureExpress(app: Express) {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
}
