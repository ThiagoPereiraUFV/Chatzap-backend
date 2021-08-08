"use strict";

module.exports = {
	fetchAuthenticatedUser(id) {
		return strapi.query("user", "users-permissions").findOne({ id }, [
			{
				path: "user_rooms",
				populate: {
					path: "room"
				}
			}, "rooms", "image", "role"
		]);
	}
};
