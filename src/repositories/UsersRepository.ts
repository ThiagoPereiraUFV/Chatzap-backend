//	Importing users data structure and User interfaces
import { users } from "../models/User";
import { User } from "../models/interfaces/User";

class UsersRepository {
	public findById(id: string) {
		const index = users.findIndex((user) => user.id === id);

		return (index !== -1) ? users[index] : null;
	}

	public findByNumber(number: string) {
		const index = users.findIndex((user) => user.number === number);

		return (index !== -1) ? users[index] : null;
	}

	public create(user: object) {
		users.push(<User>user);

		return user;
	}

	public deleteById(id: string) {
		const index = users.findIndex((user) => user.id === id);

		return (index !== -1) ? users.splice(index, 1)[0] : null;
	}

	public all() {
		return users;
	}
}

export default new UsersRepository();