const users: any[] = [];

class UserController {
	//	Get user by id
	get(id: string) {
		if(!id || !id.length) {
			return { error: "Id inválido!" };
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
			errors.push("Id inválido!");
		} else {
			id = id.trim();
		}

		if(!name || !name.length) {
			errors.push("Nome inválido!");
		} else {
			name = name.trim();
		}

		if(!number || !number.length) {
			errors.push("Número inválido!");
		} else {
			number = number.trim();
		}

		if(!room || !room.length) {
			errors.push("Sala inválida!");
		} else {
			room = room.trim();
		}

		if(errors.length) {
			return { errors };
		} else {
			const existingUser = users.find((user) => user.room === room && user.number === number);

			if(existingUser) {
				return { error: "Número não disponível!" };
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
			return { error: "Id inválido!" };
		} else {
			const index = users.findIndex((user) => user.id === id);

			if(index !== -1) {
				return { user: users.splice(index, 1)[0] };
			} else {
				return { error: "Usuário não existe!" };
			}
		}
	}

	//	Return all room users
	allOnRoom(room: string) {
		if(!room || !room.length) {
			return { error: "Nome da sala inválido!" };
		} else {
			return users.filter((user) => user.room === room);
		}
	}
}

//	Exporting User controller
export default new UserController();