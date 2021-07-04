//	Importing app resources and env
import app from "./app";
import { PORT } from "./config/env";

//	Listening on given port
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
}).on("error", (error) => {
	console.error(`Error on port:  ${PORT} \n`, error);
});
