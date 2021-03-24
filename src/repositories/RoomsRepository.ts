//	Importing rooms data structure and Room interfaces
import { rooms } from "../models/Room";
import { Room } from "../models/interfaces/Room";

class RoomsRepository {
	public findById(id: string) {
		const index = rooms.findIndex((room) => room.id === id);

		return (index !== -1) ? rooms[index] : null;
	}

	public create(room: object) {
		rooms.push(<Room>room);

		return room;
	}

	public deleteById(id: string) {
		const index = rooms.findIndex((room) => room.id === id);

		return (index !== -1) ? rooms.splice(index, 1)[0] : null;
	}

	public all() {
		return rooms;
	}
}

export default new RoomsRepository();