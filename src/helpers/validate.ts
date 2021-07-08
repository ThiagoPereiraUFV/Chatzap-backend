//  Importing express and Joi resources
import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema, object } from "joi";

export const validateBody = (schema: ObjectSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.validate(req.body);

		if(result.error) {
			return res.status(400).json(result.error.details);
		} else {
			return next();
		}
	};
};

export const validateHeaders = (schema: ObjectSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.validate(req.headers);

		if(result.error) {
			return res.status(400).json(result.error.details);
		} else {
			return next();
		}
	};
};

export const schemas = {
	createSessionSchema: object().keys({
		phone: Joi.string().required(),
		password: Joi.string().required()
	}),
	createUserSchema: object().keys({
		name: Joi.string().required(),
		phone: Joi.string().required(),
		email: Joi.string().email(),
		password: Joi.string().required(),
		passwordC: Joi.ref("password")
	}),
	updateUserSchema: object().keys({
		name: Joi.string().required(),
		phone: Joi.string().required(),
		email: Joi.string().email(),
		passwordO: Joi.string(),
		passwordN: Joi.string(),
		user: Joi.object().required()
	}),
	deleteUserSchema: object().keys({
		password: Joi.string().required(),
		user: Joi.object().required()
	}),
	createRoomSchema: object().keys({
		name: Joi.string().required(),
		user: Joi.object().required()
	}),
	updateRoomSchema: object().keys({
		name: Joi.string().required(),
		user: Joi.object().required()
	})
};
