module.exports = {
	definition: "",
	query: "",
	type: {},
	resolver: {
		Query: {
			userRoom: {
				policies: ["plugins::users-permissions.isAuthenticated", "userBelongsToChat"]
			}
		}
	}
};
