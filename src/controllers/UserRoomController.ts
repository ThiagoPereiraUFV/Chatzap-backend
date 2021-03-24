//	Importing UsersRooms repository
import UsersRoomsRepository from "../repositories/UsersRoomsRepository";

class UserRoomController {
	//	Get user-room relationship by user id
	getByIdUser(id: string) {
		if(!id || !id.length) {
			return { error: "Id inválido!" };
		} else {
			const userRoom = UsersRoomsRepository.findByIdUser(id);

			if(userRoom) {
				return { userRoom };
			} else {
				return { error: "Usuário não existe ou não está relacionado à alguma sala!" };
			}
		}
	}

	//	Get user-room relationship by room id
	getByIdRoom(id: string) {
		if(!id || !id.length) {
			return { error: "Id inválido!" };
		} else {
			const user = UsersRoomsRepository.findByIdRoom(id);

			if(user) {
				return { user };
			} else {
				return { error: "Sala não existe ou não está relacionada à algum usuário!" };
			}
		}
	}

	//	Create user-room relationship given user id and room id
	create(idUser: string, idRoom: string) {
		const errors: string[] = [];

		if(!idUser || !idUser.length) {
			errors.push("Id inválido!");
		}

		if(!idRoom || !idRoom.length) {
			errors.push("Id inválido!");
		}

		if(errors.length) {
			return { errors };
		} else {
			const existingUserRoom = UsersRoomsRepository.findByIdUserRoom(idUser, idRoom);

			if(existingUserRoom) {
				return { error: "Usuário já está vinculado à sala!" };
			} else {
				const user = {
					idUser,
					idRoom
				};

				UsersRoomsRepository.create(user);

				return { user };
			}
		}
	}

	//	Delete user-room relationship given user id and room id
	deleteByIdUserRoom(idUser: string, idRoom: string) {
		const errors: string[] = [];

		if(!idUser || !idUser.length) {
			errors.push("Id inválido!");
		}

		if(!idRoom || !idRoom.length) {
			errors.push("Id inválido!");
		}

		if(errors.length) {
			return { errors };
		} else {
			const userRoom = UsersRoomsRepository.deleteByIdUserRoom(idUser, idRoom);

			if(userRoom) {
				return { userRoom };
			} else {
				return { error: "O usuário não está vinculado à sala!" };
			}
		}
	}
}

//	Exporting User controller
export default new UserRoomController();