const users: any[] = [];

class UserController {
	//	Get user by id
	get(id: string) {
		const index = users.findIndex((user) => user.id === id);

		if(index !== -1) {
			return { user: users[index] };
		} else {
			return { error: "User doesn't exist!" };
		}
	}

	//	Create user given id, name and room
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

	//	Delete user given id
	delete(id: string) {
		const index = users.findIndex((user) => user.id === id);

		if(index !== -1) {
			return { user: users.splice(index, 1)[0] };
		} else {
			return { error: "User doesn't exist!" };
		}
	}

	//	Return all room users
	allOnRoom(room: string) {
		return users.filter((user) => user.room === room);
	}
}

//	Exporting User controller
export default new UserController();