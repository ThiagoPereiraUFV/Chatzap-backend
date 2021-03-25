//	Importing mongoose resources
import mongoose from "mongoose";
require("dotenv").config();

class Database {
	private uri: string;

	//	Setting up database connection
	constructor() {
		mongoose.Promise = global.Promise;
		mongoose.set("useFindAndModify", false);

		const serverProtocol = "mongodb+srv://";
		const dbUser = (["test", "dev"].includes(<string>process.env.NODE_ENV)) ? "tester" : "admin";
		const password = (["test", "dev"].includes(<string>process.env.NODE_ENV)) ?
			"testerpassword" : process.env.DBPASSWORD;
		const cluster = "@easycontacts.yvbgh.mongodb.net";
		const dbOptions = "?retryWrites=true&w=majority";
		const dbName = (["test", "dev"].includes(<string>process.env.NODE_ENV)) ? "test" : "production";

		this.uri = serverProtocol + dbUser + ":" + password + cluster + "/" + dbName + dbOptions;
	}

	//	Connect to database
	public connect(): void {
		mongoose.connect(this.uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}).then(() => {
			if(process.env.NODE_ENV != "test") {
				console.log("Connection to database has been established successfully.");
			}
		}).catch((error) => {
			console.error("Unable to connect to database:\n", error);
		});
	}
}

//	Exporting database object
export default new Database();