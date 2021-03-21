const rooms: any[] = [];

class RoomController {
	//	Get room by name
	getByName(name: string) {
		const index = rooms.findIndex((room) => room.name === name);

		if(index !== -1) {
			return { room: rooms[index] };
		} else {
			return { error: "Room doesn't exist!" };
		}
	}

	//	Get room by id
	getById(id: string) {
		const index = rooms.findIndex((room) => room.id === id);

		if(index !== -1) {
			return { room: rooms[index] };
		} else {
			return { error: "Room doesn't exist!" };
		}
	}

	//	Create room given id and name
	create(id: string, name: string) {
		name = name.trim().toLowerCase();

		const existingRoom = rooms.find((room) => room.name === name);

		if(existingRoom) {
			return { error: "Room is not available!" };
		} else {
			const room = {
				id,
				name
			};

			rooms.push(room);

			return { room };
		}
	}

	//	Delete room given name
	deleteByName(name: string) {
		const index = rooms.findIndex((room) => room.name === name);

		if(index !== -1) {
			return { room: rooms.splice(index, 1)[0] };
		} else {
			return { error: "Room doesn't exist!" };
		}
	}

	//	Delete room given id
	deleteById(name: string) {
		const index = rooms.findIndex((room) => room.name === name);

		if(index !== -1) {
			return { room: rooms.splice(index, 1)[0] };
		} else {
			return { error: "Room doesn't exist!" };
		}
	}
}

//	Exporting Room controller
export default new RoomController();