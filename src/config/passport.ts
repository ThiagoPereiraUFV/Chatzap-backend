//	Importing passport strategies and env
import { Strategy as jwtStrategy, ExtractJwt } from "passport-jwt";
import { SECRET } from "./env";

export const passportJwt = new jwtStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: SECRET
}, async (payload, done) => {
	try {
		done(null, payload.userId);
	} catch(error) {
		done(error, false);
	}
});
