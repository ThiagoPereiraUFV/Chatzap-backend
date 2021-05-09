//	Importing mongoose, supertest and app resources
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

//	Test variables
var userToken = ["", ""];
var roomId = ["", ""];
var userRoomId = ["", "", "", ""];
const phone = [Math.floor(Math.random()*(10**11)).toString(), Math.floor(Math.random()*(10**11)).toString()];

describe("User Room", () => {
	afterAll(async () => {
		await mongoose.disconnect().catch((error) => {
			return console.error("Unable to disconnect from database:", error);
		});
	});

	test("Should be able to create a user", async () => {
		await request(app).post("/user").send({
			name: "User Room Example",
			phone: phone[0],
			password: "password",
			passwordC: "password"
		}).expect(201).then((response) => userToken[0] = response.body.token);
	});

	test("Should be able to create a second user", async () => {
		await request(app).post("/user").send({
			name: "User Room Example 2",
			phone: phone[1],
			password: "password",
			passwordC: "password"
		}).expect(201).then((response) => userToken[1] = response.body.token);
	});

	test("Should be able to create a room by first created user", async () => {
		await request(app).post("/room").send({
			name: "Room Example 1"
		}).set({
			"Authorization": userToken[0]
		}).expect(201).then((response) => roomId[0] = response.body._id);
	});

	test("Should be able to create a room by second created user", async () => {
		await request(app).post("/room").send({
			name: "Room Example 2"
		}).set({
			"Authorization": userToken[1]
		}).expect(201).then((response) => roomId[1] = response.body._id);
	});

	test("Should not be able to create a user room relationship between first user and first room", async () => {
		await request(app).post("/userRoom/" + roomId[0]).set({
			"Authorization": userToken[0]
		}).expect(400);
	});

	test("Should not be able to create a user room relationship between second user and second room", async () => {
		await request(app).post("/userRoom/" + roomId[1]).set({
			"Authorization": userToken[1]
		}).expect(400);
	});

	test("Should be able to create a user room relationship between first user and second room", async () => {
		await request(app).post("/userRoom/" + roomId[1]).set({
			"Authorization": userToken[0]
		}).expect(201).then((response) => userRoomId[2] = response.body._id);
	});

	test("Should be able to create a user room relationship between second user and first room", async () => {
		await request(app).post("/userRoom/" + roomId[0]).set({
			"Authorization": userToken[1]
		}).expect(201).then((response) => userRoomId[3] = response.body._id);
	});

	test("Should be able to delete first user room relationship", async () => {
		await request(app).delete("/userRoom/" + roomId[0]).set({
			"Authorization": userToken[0]
		}).expect(200);
	});

	test("Should be able to delete second user room relationship", async () => {
		await request(app).delete("/userRoom/" + roomId[1]).set({
			"Authorization": userToken[1]
		}).expect(200);
	});

	test("Should be able to delete first user room relationship", async () => {
		await request(app).delete("/userRoom/" + roomId[1]).set({
			"Authorization": userToken[0]
		}).expect(200);
	});

	test("Should be able to delete second user room relationship", async () => {
		await request(app).delete("/userRoom/" + roomId[0]).set({
			"Authorization": userToken[1]
		}).expect(200);
	});

	test("Should be able to delete first room", async () => {
		await request(app).delete("/room/" + roomId[0]).set({
			"Authorization": userToken[0]
		}).expect(200);
	});

	test("Should be able to delete second room", async () => {
		await request(app).delete("/room/" + roomId[1]).set({
			"Authorization": userToken[1]
		}).expect(200);
	});

	test("Should be able to delete first user", async () => {
		await request(app).delete("/user").set({
			"Authorization": userToken[0],
			password: "password"
		}).expect(200);
	});

	test("Should be able to delete second user", async () => {
		await request(app).delete("/user").set({
			"Authorization": userToken[1],
			password: "password"
		}).expect(200);
	});
});