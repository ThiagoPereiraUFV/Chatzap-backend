import users from "../models/User";

class UsersRepository {
	public async findById(id: string | undefined) {
		return await users.findById(id);
	}

	public async findByPhone(phone: string | undefined) {
		return await users.findOne({ phone: (<string>phone).trim() });
	}

	public async create(user: object) {
		return await users.create(user);
	}

	public async all() {
		return await users.find().sort({
			name: "asc",
			creationDate: "desc"
		});
	}
}

export default new UsersRepository();
