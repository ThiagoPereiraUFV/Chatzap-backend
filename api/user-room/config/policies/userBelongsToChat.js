"use strict";

/**
 * `userBelongsToChat` policy.
 */

module.exports = async (ctx, next) => {
	if(ctx?.state?.user && await strapi?.services["user-room"]?.findOne({ id: ctx?.query?.id, user: ctx?.state?.user?.id })) {
		return await next();
	} else {
		return ctx.send({
			message: "You're not allowed to perform this action!"
		}, 403);
	}
};
