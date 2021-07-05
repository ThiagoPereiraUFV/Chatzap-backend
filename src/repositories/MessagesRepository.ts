import messages from "../models/Message";

class MessagesRepository {
	public async findById(id: string) {
		return await messages.findById(id).populate("userId");
	}

	public async findByRoomId(roomId: string) {
		return await messages.find({ roomId }).populate("userId");
	}

	public async create(message: Record<string, unknown>) {
		return await messages.create(message);
	}

	public async delete(userId: string | undefined, roomId: string | undefined) {
		return await messages.deleteOne({ userId, roomId });
	}

	public async all() {
		return await messages.find().sort({
			creationDate: "desc"
		});
	}

	public async find(roomId: string | undefined, query: string) {
		return await messages.find({
			roomId,
			text: new RegExp(query, "iu")
		}).sort({
			creationDate: "desc"
		});
	}
}

export default new MessagesRepository();
