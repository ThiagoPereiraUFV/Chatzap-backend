//  Importing User model
import users from "../models/User";

class UsersRepository {
	public async findById(id: string | undefined) {
		return await users.findById(id);
	}

	public async findByPhone(phone: string) {
		return await users.findOne({ phone: phone.trim() });
	}

	public async create(user: Record<string, unknown>) {
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
