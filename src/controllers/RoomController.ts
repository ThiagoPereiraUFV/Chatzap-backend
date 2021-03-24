//	Importing Rooms repository
import RoomsRepository from "../repositories/RoomsRepository";

class RoomController {
	//	Get room by id
	get(id: string) {
		if(!id || !id.length) {
			return { error: "Id inválido!" };
		} else {
			const room = RoomsRepository.findById(id);

			if(room) {
				return { room };
			} else {
				return { error: "Sala não existe!" };
			}
		}
	}

	//	Create room given id and name
	create(id: string, name: string) {
		const errors: string[] = [];

		if(!id || !id.length) {
			errors.push("Id inválido!");
		}

		if(!name || !name.length) {
			errors.push("Nome inválido!");
		} else {
			name = name.trim();
		}

		if(errors.length) {
			return { errors };
		} else {
			const existingRoom = RoomsRepository.findById(id);

			if(existingRoom) {
				return { error: "Sala não disponível!" };
			} else {
				const room = {
					id,
					name,
					nMembers: 0
				};

				RoomsRepository.create(room);

				return { room };
			}
		}
	}

	//	Delete room given id
	delete(id: string) {
		if(!id || !id.length) {
			return { error: "Id inválido!" };
		} else {
			const room = RoomsRepository.deleteById(id);

			if(room) {
				return { room };
			} else {
				return { error: "Sala não existe!" };
			}
		}
	}

	//	Return all room users
	allOnRoom(room: string) {/*
		if(!room || !room.length) {
			return { error: "Nome da sala inválido!" };
		} else {
			return RoomsRepository.allonRoom(room);
		}*/
	}
}

//	Exporting Room controller
export default new RoomController();