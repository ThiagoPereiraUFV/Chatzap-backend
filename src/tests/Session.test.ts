//	Importing mongoose, supertest and app resources
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

//	Test variables
var userToken = "";
const username = Math.random().toString(36).substr(2, 9);
const phone = Math.floor(Math.random()*(10**11)).toString();

describe("Session", () => {
	afterAll(async () => {
		await mongoose.disconnect().catch((error) => {
			return console.error("Unable to disconnect from database:", error);
		});
	});

	test("Should be able to create a user", async () => {
		return await request(app).post("/user").send({
			name: "User Session Example",
			phone: phone,
			email: username + ".session@example.com",
			password: "password",
			passwordC: "password"
		}).expect(201).then((response) => userToken = response.body.token);
	});

	test("Should be able to create a session", async () => {
		await request(app).post("/session").send({
			phone: phone,
			password: "password"
		}).set({
			"Authorization": "Bearer " + userToken
		}).expect(201).then((response) => userToken = response.body.token);
	});

	test("Should be able to get a session", async () => {
		await request(app).get("/session").set({
			"Authorization": "Bearer " + userToken
		}).expect(200);
	});

	test("Should be able to delete user", async () => {
		return await request(app).delete("/user").set({
			"Authorization": "Bearer " + userToken,
			password: "password"
		}).expect(200);
	});
});