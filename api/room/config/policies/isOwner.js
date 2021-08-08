"use strict";

/**
 * `isOwner` policy.
 */

module.exports = async (ctx, next) => {
	if(ctx?.state?.user && await strapi?.services?.room?.findOne({ id: ctx?.params?.id, owner: ctx?.state?.user?.id })) {
		return await next();
	} else {
		return ctx.send({
			message: "You're not allowed to perform this action!"
		}, 403);
	}
};
