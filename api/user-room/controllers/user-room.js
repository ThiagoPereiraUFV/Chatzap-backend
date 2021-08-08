"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
	async create(ctx) {
		const user = ctx?.req?.user;
		const body = ctx?.request?.body;
		const { roomId } = body;

		if(!user) {
			return ctx.send({
				message: "User not found!"
			}, 404);
		}

		if(!roomId || !roomId?.trim()?.length) {
			return ctx.send({
				message: "Invalid room id!"
			}, 400);
		}

		try {
			const room = await strapi?.services?.room?.findOne({ _id: roomId });

			if(!room) {
				return ctx.send({
					message: "Room not found!"
				}, 404);
			}

			const userroom = await strapi?.services["user-room"]?.findOne({ room: room?._id, user: user?._id });

			if(userroom) {
				return ctx.send({
					message: "Cannot create another relationship!"
				}, 400);
			}

			const newUserroom = await strapi?.services["user-room"]?.create({ room: room?._id, user: user?._id });

			return ctx.send(newUserroom, 201);
		} catch(err) {
			return ctx.send({ error: err }, 500);
		}
	}
};
