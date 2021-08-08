module.exports = (env, def) => {
	return process?.env[env] ?? def;
};
