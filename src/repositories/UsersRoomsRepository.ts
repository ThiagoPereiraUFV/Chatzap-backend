import usersRooms from "../models/UserRoom";

class UsersRoomsRepository {
	public async findById(id: string) {
		return await usersRooms.findById(id);
	}

	public async findByUserId(userId: string) {
		return await usersRooms.find({ userId }).populate("roomId");
	}

	public async findByRoomId(roomId: string) {
		return await usersRooms.find({ roomId }).populate("userId");
	}

	public async create(userRoom: object) {
		return await usersRooms.create(userRoom);
	}

	public async delete(userId: string | undefined, roomId: string | undefined) {
		return await usersRooms.deleteOne({ userId, roomId });
	}

	public async all() {
		return await usersRooms.find().sort({
			creationDate: "desc"
		});
	}
}

export default new UsersRoomsRepository();