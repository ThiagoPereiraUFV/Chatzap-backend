module.exports = ({ env }) => ({
	settings: {
		cors: {
			enabled: true,
			headers: "*",
			origin: [env("API_URL", "http://localhost:1337"), env("URL_ORIGIN", "http://localhost:3000")]
		}
	}
});
