//	Importing mongoose resources and envs
import mongoose from "mongoose";
import { DBPASSWORD, NODE_ENV } from "./env";

class Database {
	private uri: string;

	//	Setting up database connection
	constructor() {
		mongoose.Promise = global.Promise;
		mongoose.set("useFindAndModify", false);

		const serverProtocol = "mongodb+srv://";
		const dbUser = (["test", "dev"].includes(NODE_ENV)) ? "tester" : "admin";
		const password = (["test", "dev"].includes(NODE_ENV)) ?
			"testerpassword" : DBPASSWORD;
		const cluster = "@chatzap.t71lo.mongodb.net";
		const dbOptions = "?retryWrites=true&w=majority";
		const dbName = NODE_ENV === "test" ? "test" : NODE_ENV === "dev" ? "dev" : "production";

		this.uri = `${serverProtocol + dbUser}:${password}${cluster}/${dbName}${dbOptions}`;
	}

	//	Connect to database
	public async connect(): Promise<void> {
		await mongoose.connect(this.uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}).then(() => {
			if(NODE_ENV !== "test") {
				console.log("Connection to database has been established successfully.");
			}
		}).catch((error) => {
			console.error("Unable to connect to database:\n", error);
		});
	}
}

//	Exporting database object
export default new Database();
