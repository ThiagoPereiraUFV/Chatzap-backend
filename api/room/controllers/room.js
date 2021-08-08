"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
	async create(ctx) {
		const user = ctx?.req?.user;
		const body = ctx?.request?.body;
		const { name } = body;

		if(!user) {
			return ctx.send({
				message: "User not found!"
			}, 404);
		}

		if(!name || !name?.trim()?.length) {
			return ctx.send({
				message: "Invalid room name!"
			}, 400);
		}

		try {
			const room = await strapi?.services?.room?.create({ name, owner: user?._id });
			const userroom = await strapi?.services["user-room"]?.create({ room: room?._id, user: user?._id });

			return ctx.send(userroom, 201);
		} catch(err) {
			return ctx.send({ error: err }, 500);
		}
	}
};
