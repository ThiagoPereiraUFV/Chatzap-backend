const users: any[] = [];

class UserController {
	get(id: string) {
		const index = users.findIndex((user) => user.id === id);

		if(index !== -1) {
			return { user: users[index] };
		} else {
			return { error: "User doesn't exist!" };
		}
	}

	create(id: string, name: string, room: string) {
		name = name.trim().toLowerCase();
		room = room.trim().toLowerCase();

		const existingUser = users.find((user) => user.room === room && user.name === name);

		if(existingUser) {
			return { error: "Username is not available!" };
		} else {
			const user = {
				id,
				name,
				room
			};

			users.push(user);

			return { user };
		}
	}

	delete(id: string) {
		const index = users.findIndex((user) => user.id === id);

		if(index !== -1) {
			return { user: users.splice(index, 1)[0] };
		} else {
			return { error: "User doesn't exist!" };
		}
	}

	allOnRoom(room: string) {
		return users.filter((user) => user.room === room);
	}
}

export default new UserController();