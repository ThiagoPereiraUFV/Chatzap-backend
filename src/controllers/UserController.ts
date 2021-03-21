const users: any[] = [];

class UserController {
	//	Get user by id
	get(id: string) {
		if(!id || !id.length) {
			return { error: "Invalid id!" };
		} else {
			const index = users.findIndex((user) => user.id === id);

			if(index !== -1) {
				return { user: users[index] };
			} else {
				return { error: "User doesn't exist!" };
			}
		}
	}

	//	Create user given id, name number and room
	create(id: string, name: string, number: string, room: string) {
		const errors: string[] = [];

		if(!id || !id.length) {
			errors.push("Invalid id!");
		} else {
			id = id.trim();
		}

		if(!name || !name.length) {
			errors.push("Invalid name!");
		} else {
			name = name.trim();
		}

		if(!number || !number.length) {
			errors.push("Invalid number!");
		} else {
			number = number.trim();
		}

		if(!room || !room.length) {
			errors.push("Invalid room!");
		} else {
			room = room.trim();
		}

		if(errors.length) {
			return { errors };
		} else {
			const existingUser = users.find((user) => user.room === room && user.name === name);

			if(existingUser) {
				return { error: "Username is not available!" };
			} else {
				const user = {
					id,
					name,
					number,
					room
				};

				users.push(user);

				return { user };
			}
		}
	}

	//	Delete user given id
	delete(id: string) {
		if(!id || !id.length) {
			return { error: "Invalid id!" };
		} else {
			const index = users.findIndex((user) => user.id === id);

			if(index !== -1) {
				return { user: users.splice(index, 1)[0] };
			} else {
				return { error: "User doesn't exist!" };
			}
		}
	}

	//	Return all room users
	allOnRoom(room: string) {
		if(!room || !room.length) {
			return { error: "Invalid room name!" };
		} else {
			return users.filter((user) => user.room === room);
		}
	}
}

//	Exporting User controller
export default new UserController();