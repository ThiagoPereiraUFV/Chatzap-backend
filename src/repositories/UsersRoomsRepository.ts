import usersRooms from "../models/UserRoom";

class UsersRoomsRepository {
	public async findById(id: string) {
		return await usersRooms.findById(id).populate("roomId");
	}
	public async findByIds(userId: string, roomId: string) {
		return await usersRooms.findOne({ userId, roomId }).populate("roomId");
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

	public async delete(userId: string | undefined, roomId: string) {
		return await usersRooms.findOneAndDelete({ userId, roomId });
	}

	public async deleteAllFromUser(userId: string | undefined) {
		return await usersRooms.deleteMany({ userId });
	}

	public async all() {
		return await usersRooms.find().sort({
			creationDate: "desc"
		}).populate("roomId").populate("userId");
	}

	public async find(userId: string | undefined, query: string | undefined) {
		return await usersRooms.find({
			userId
		}).populate({
			path: "roomId",
			match: {
				name: new RegExp(<string>query, "i")
			}
		}).sort({
			creationDate: "desc"
		});
	}
}

export default new UsersRoomsRepository();