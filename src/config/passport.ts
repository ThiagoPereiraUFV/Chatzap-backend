//	Importing passport strategies and env
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { SECRET } from "./env";

//	Importing Users repository
import UsersRepository from "../repositories/UsersRepository";

export const passportJwt = new JWTStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: SECRET
}, async ({ userId }, done) => {
	return await UsersRepository.findById(userId).then((user) => {
		if(user) {
			return done(null, user);
		} else {
			return done(true);
		}
	}).catch((error) => {
		return done(error, false);
	});
});
