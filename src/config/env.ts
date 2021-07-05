require("dotenv").config();

export const DBPASSWORD = process.env.DBPASSWORD ?? "";
export const SECRET = process.env.SECRET ?? "";
export const PORT = process.env.PORT || 4000;
export const NODE_ENV = process.env.NODE_ENV ?? "";
