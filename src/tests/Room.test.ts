//	Importing mongoose, supertest and app resources
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

//	Test file paths
const fileTest = ["./src/tests/files/test1.png", "./src/tests/files/test2.json"];

//	Test variables
var userToken = "";
var roomId = ["", ""];
const phone = Math.floor(Math.random()*(10**11)).toString();

describe("Room", () => {
	afterAll(async () => {
		await mongoose.disconnect().catch((error) => {
			return console.error("Unable to disconnect from database:", error);
		});
	});

	test("Should be able to create a user", async () => {
		await request(app).post("/user").send({
			name: "User Room Example",
			phone: phone,
			password: "password",
			passwordC: "password"
		}).expect(201).then((response) => userToken = response.body.token);
	});

	test("Should be able to create a room", async () => {
		await request(app).post("/room").send({
			name: "Room Example"
		}).set({
			"x-access-token": userToken
		}).expect(201).then((response) => roomId[0] = response.body._id);
	});

	test("Should be able to create another room", async () => {
		await request(app).post("/room").send({
			name: "Room Example 2"
		}).set({
			"x-access-token": userToken
		}).expect(201).then((response) => roomId[1] = response.body._id);
	});

	test("Should be able to get all user rooms", async () => {
		await request(app).get("/room").set({
			"x-access-token": userToken
		}).expect(200);
	});

	test("Should be able to get all database rooms", async () => {
		await request(app).get("/allContacts").expect(200);
	});

	test("Should be able to get two rooms named Room Example", async () => {
		await request(app).get("/searchContact?q=Room Example").set({
			"x-access-token": userToken
		}).expect(200).then((response) => expect(response.body.length).toBe(2));
	});

	test("Should be able to get zero rooms named Maria", async () => {
		await request(app).get("/searchContact?q=Maria").set({
			"x-access-token": userToken
		}).expect(200).then((response) => expect(response.body.length).toBe(0));
	});

	test("Should be able to update name and email of the first created room", async () => {
		await request(app).put("/room/" + roomId[0]).send({
			name: "Room Updated Example",
			email: "room.updated@example.com"
		}).set({
			"x-access-token": userToken
		}).expect(200);
	});

	test("Should be able to update image of the first created room", async () => {
		await request(app).put("/contactImage/" + roomId[0]).attach("image", fileTest[0]).set({
			"x-access-token": userToken
		}).expect(200).then((response) => {
			return request(app).get("/files/" + response.body.image).expect(200);
		});
	});

	test("Should not be able to update image of the first created room", async () => {
		await request(app).put("/contactImage/" + roomId[0]).attach("image", fileTest[1]).set({
			"x-access-token": userToken
		}).expect(400);
	});

	test("Should be able to delete first created room", async () => {
		await request(app).delete("/room/" + roomId[0]).set({
			"x-access-token": userToken
		}).expect(200);
	});

	test("Should not be able to update name and email of the first created room", async () => {
		await request(app).put("/room/" + roomId[0]).send({
			name: "Room Updated Example",
			email: "room.updated@example.com"
		}).set({
			"x-access-token": userToken
		}).expect(404);
	});

	test("Should not be able to delete first created room", async () => {
		await request(app).delete("/room/" + roomId[0]).set({
			"x-access-token": userToken
		}).expect(404);
	});

	test("Should be able to delete user", async () => {
		await request(app).delete("/user").set({
			"x-access-token": userToken,
			password: "password"
		}).expect(200);
	});

	test("Should not be able to get second created room", async () => {
		await request(app).get("/room/" + roomId[1]).set({
			"x-access-token": userToken
		}).expect(404);
	});
});