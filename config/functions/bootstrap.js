"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

//	Importing socket.io resources
const socketio = require("socket.io");

//	Importing env getter
const env = require("../functions/env");

//	Connected sockets
const sockets = new Map();

module.exports = () => {
	const io = socketio(strapi.server, {
		cors: {
			origin: env("URL_ORIGIN", "http://localhost:3000"),
			methods: ["GET", "POST"],
			credentials: true
		}
	});

	//	User connection events
	io.on("connection", (socket) => {
		//	User gets online
		socket.on("online", async (userId) => {
			try {
				sockets.set(socket.id, userId);
				const user = await strapi?.query("user", "users-permissions")?.findOne({ id: userId }, [
					{
						path: "user_rooms",
						populate: {
							path: "room"
						}
					}
				]);
				const userRooms = user?.user_rooms ?? [];

				for(const userRoom of userRooms) {
					socket?.join(String(userRoom?.room?.id));
				}

				await strapi?.query("user", "users-permissions")?.update({ id: userId }, { online: true });
			} catch(err) {
				strapi.log.error(err);
			}
		});

		//	User joins a room
		socket.on("joinRoom", async (roomId) => {
			try {
				const userId = sockets?.get(socket.id);

				if(userId) {
					const user = await strapi?.query("user", "users-permissions")?.findOne({ id: userId });
					const userRoom = await strapi?.services["user-room"].findOne({ user: user?.id, room: roomId });

					if(userRoom) {
						const msg = {
							user: user?.id,
							room: roomId,
							text: `ROOM: ${user?.name} entrou na sala`
						};
						const createdMsg = await strapi?.services?.message.create(msg);

						if(createdMsg) {
							socket.join(roomId);
							socket.to(roomId).emit("message", createdMsg);
						}
					}
				}
			} catch(err) {
				strapi.log.error(err);
			}
		});

		//	User leaves a room
		socket.on("leaveRoom", async (roomId) => {
			try {
				const userId = sockets?.get(socket.id);

				if(userId) {
					const user = await strapi?.query("user", "users-permissions")?.findOne({ id: userId });
					const userRoom = await strapi?.services["user-room"].delete({ user: user?.id, room: roomId });

					if(userRoom) {
						const msg = {
							user: user?.id,
							room: roomId,
							text: `ROOM: ${user?.name} saiu na sala`
						};
						const createdMsg = await strapi?.services?.message.create(msg);

						if(createdMsg) {
							socket.leave(roomId);
							socket.to(roomId).emit("message", createdMsg);
						}
					}
				}
			} catch(err) {
				strapi.log.error(err);
			}
		});

		//	Get room messages
		socket.on("getMessages", async (roomId) => {
			try {
				const room = await strapi?.services?.room?.findOne({ id: roomId }, [
					{
						path: "messages",
						populate: {
							path: "user"
						}
					}
				]);
				const roomMessages = room?.messages ?? [];

				socket.emit("messages", roomMessages);
			} catch(err) {
				strapi.log.error(err);
			}
		});

		//	Get room members
		socket.on("getMembers", async (roomId) => {
			try {
				const room = await strapi?.services?.room?.findOne({ id: roomId }, [
					{
						path: "user_rooms",
						populate: {
							path: "user"
						}
					}
				]);

				const roomMembers = room?.user_rooms?.map((ur) => ur?.user) ?? [];

				socket.emit("members", roomMembers);
			} catch(err) {
				strapi.log.error(err);
			}
		});

		//	User sending message
		socket.on("sendMessage", async (message, roomId) => {
			try {
				const userId = sockets?.get(socket.id);

				if(userId) {
					const msg = {
						user: sockets?.get(socket.id),
						room: roomId,
						text: message
					};
					const createdMsg = await strapi?.services?.message.create(msg);

					if(createdMsg) {
						io.to(roomId).emit("message", createdMsg);
					}
				}
			} catch(err) {
				strapi.log.error(err);
			}
		});

		//	User gets offline
		socket.on("disconnect", async () => {
			try {
				const userId = sockets?.get(socket.id) ?? "";

				if(userId?.trim()?.length) {
					const user = await strapi?.query("user", "users-permissions")?.update({ id: userId }, { online: false });

					if(user) {
						sockets?.delete(socket.id);
					}
				}
			} catch(err) {
				strapi.log.error(err);
			}
		});
	});
};
