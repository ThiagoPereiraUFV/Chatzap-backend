//	Importing usersRooms data structure and UserRoom interfaces
import { usersRooms } from "../models/UserRoom";
import { UserRoom } from "../models/interfaces/UserRoom";

class UsersRoomsRepository {
	public findByIdUserRoom(idUser: string, idRoom: string) {
		const index = usersRooms.findIndex((userRoom) => userRoom.idUser === idUser && userRoom.idRoom === idRoom);

		return (index !== -1) ? usersRooms[index] : null;
	}

	public findByIdUser(idUser: string) {
		const index = usersRooms.findIndex((userRoom) => userRoom.idUser === idUser);

		return (index !== -1) ? usersRooms[index] : null;
	}

	public findByIdRoom(idRoom: string) {
		const index = usersRooms.findIndex((userRoom) => userRoom.idRoom === idRoom);

		return (index !== -1) ? usersRooms[index] : null;
	}

	public create(userRoom: object) {
		usersRooms.push(<UserRoom>userRoom);

		return userRoom;
	}

	public deleteByIdUserRoom(idUser: string, idRoom: string) {
		const index = usersRooms.findIndex((userRoom) => userRoom.idUser === idUser && userRoom.idRoom === idRoom);

		return (index !== -1) ? usersRooms.splice(index, 1)[0] : null;
	}

	public all() {
		return usersRooms;
	}
}

export default new UsersRoomsRepository();