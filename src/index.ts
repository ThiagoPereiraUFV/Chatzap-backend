//	Importing app resources
import app from "./app";

//	Defining port
const PORT = process.env.PORT || 4000;

//	Listening on given port
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
}).on("error", (error) => {
	console.error(`Error on port:  ${PORT} \n`, error);
});