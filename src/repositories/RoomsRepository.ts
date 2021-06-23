import rooms from "../models/Room";

class RoomsRepository {
	public async create(room: object) {
		return await rooms.create(room);
	}

	public async findById(id: string | undefined) {
		return await rooms.findById(id);
	}

	public async findByIds(_id: string | undefined, userId: string | undefined) {
		return await rooms.findOne({ _id, userId });
	}

	public async findByName(name: string | undefined) {
		return await rooms.find({ name });
	}

	public async allFromUser(userId: string | undefined) {
		return await rooms.find({ userId }).sort({
			name: "asc",
			creationDate: "desc"
		});
	}

	public async all() {
		return await rooms.find().sort({
			name: "asc",
			creationDate: "desc"
		}).populate("userId");
	}

	public async find(userId: string | undefined, query: string | undefined) {
		return await rooms.find({
			userId,
			name: new RegExp(<string>query, "iu")
		}).sort({
			name: "asc",
			creationDate: "desc"
		});
	}

	public async update(_id: string | undefined, userId: string | undefined, room: object) {
		return await rooms.findOneAndUpdate({ _id, userId }, room);
	}

	public async delete(_id: string | undefined, userId: string | undefined) {
		return await rooms.findOneAndDelete({ _id, userId });
	}
}

export default new RoomsRepository();
