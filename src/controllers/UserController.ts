//	Importing Users repository
import UsersRepository from "../repositories/UsersRepository";

class UserController {
	//	Get user by id
	getById(id: string) {
		if(!id || !id.length) {
			return { error: "Id inválido!" };
		} else {
			const user = UsersRepository.findById(id);

			if(user) {
				return { user };
			} else {
				return { error: "Usuário não existe!" };
			}
		}
	}

	//	Get user by id
	getByNumber(number: string) {
		if(!number || !number.length) {
			return { error: "Número inválido!" };
		} else {
			const user = UsersRepository.findByNumber(number);

			if(user) {
				return { user };
			} else {
				return { error: "Usuário não existe!" };
			}
		}
	}

	//	Create user given id, name and number
	create(id: string, name: string, number: string) {
		const errors: string[] = [];

		if(!id || !id.length) {
			errors.push("Id inválido!");
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

		if(errors.length) {
			return { errors };
		} else {
			const existingUser = UsersRepository.findByNumber(number);

			if(existingUser) {
				return { error: "Número não disponível!" };
			} else {
				const user = {
					id,
					name,
					number,
					online: false
				};

				UsersRepository.create(user);

				return { user };
			}
		}
	}

	//	Delete user given id
	delete(id: string) {
		if(!id || !id.length) {
			return { error: "Id inválido!" };
		} else {
			const user = UsersRepository.deleteById(id);

			if(user) {
				return { user };
			} else {
				return { error: "Usuário não existe!" };
			}
		}
	}

	//	Return all room users
	allUserRooms(room: string) {/*
		if(!room || !room.length) {
			return { error: "Nome da sala inválido!" };
		} else {
			return UsersRepository.allonRoom(room);
		}*/
	}
}

//	Exporting User controller
export default new UserController();