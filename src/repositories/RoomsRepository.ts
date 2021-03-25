import rooms from "../models/Room";

class RoomsRepository {
	public async create(room: object) {
		return await rooms.create(room);
	}

	public async findById(id: string) {
		return await rooms.findById(id);
	}

	public async findByName(name: string) {
		return await rooms.find({ name });
	}

	public async all() {
		return await rooms.find().sort({
			name: "asc",
			creationDate: "desc"
		});
	}

	public async find(query: string) {
		return await rooms.find({
			$or: [
				{
					name: {
						$regex: ".*" + query + ".*",
						$options: "i"
					}
				}
			]
		}).sort({
			name: "asc",
			creationDate: "desc"
		});
	}
}

export default new RoomsRepository();