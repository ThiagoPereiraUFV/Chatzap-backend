//	Importing mongoose, supertest and app resources
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

//	Test file paths
const fileTest = ["./src/tests/files/test1.png", "./src/tests/files/test2.json"];

//	Test variables
var userToken = "";
var contactId = ["", ""];
const username = Math.random().toString(36).substr(2, 9);

describe("Contact", () => {
	afterAll(async () => {
		await mongoose.disconnect().catch((error) => {
			return console.error("Unable to disconnect from database:", error);
		});
	});

	test("Should be able to create a user", async () => {
		await request(app).post("/user").send({
			name: "User Contact Example",
			email: username + ".contact@example.com",
			password: "password",
			passwordC: "password"
		}).expect(201).then((response) => userToken = response.body.token);
	});

	test("Should be able to create a contact", async () => {
		await request(app).post("/contact").send({
			name: "Contact Example",
			email: "contact@example.com",
			phone: "4002-8922"
		}).set({
			"x-access-token": userToken
		}).expect(201).then((response) => contactId[0] = response.body._id);
	});

	test("Should be able to create another contact", async () => {
		await request(app).post("/contact").send({
			name: "Contact Example 2",
			email: "contact2@example.com",
			phone: "4002-8922"
		}).set({
			"x-access-token": userToken
		}).expect(201).then((response) => contactId[1] = response.body._id);
	});

	test("Should be able to get all user contacts", async () => {
		await request(app).get("/contact").set({
			"x-access-token": userToken
		}).expect(200);
	});

	test("Should be able to get all database contacts", async () => {
		await request(app).get("/allContacts").expect(200);
	});

	test("Should be able to get two contacts named Contact Example", async () => {
		await request(app).get("/searchContact?q=Contact Example").set({
			"x-access-token": userToken
		}).expect(200).then((response) => expect(response.body.length).toBe(2));
	});

	test("Should be able to get zero contacts named Maria", async () => {
		await request(app).get("/searchContact?q=Maria").set({
			"x-access-token": userToken
		}).expect(200).then((response) => expect(response.body.length).toBe(0));
	});

	test("Should be able to update name and email of the first created contact", async () => {
		await request(app).put("/contact/" + contactId[0]).send({
			name: "Contact Updated Example",
			email: "contact.updated@example.com"
		}).set({
			"x-access-token": userToken
		}).expect(200);
	});

	test("Should be able to update image of the first created contact", async () => {
		await request(app).put("/contactImage/" + contactId[0]).attach("image", fileTest[0]).set({
			"x-access-token": userToken
		}).expect(200).then((response) => {
			return request(app).get("/files/" + response.body.image).expect(200);
		});
	});

	test("Should not be able to update image of the first created contact", async () => {
		await request(app).put("/contactImage/" + contactId[0]).attach("image", fileTest[1]).set({
			"x-access-token": userToken
		}).expect(400);
	});

	test("Should be able to delete first created contact", async () => {
		await request(app).delete("/contact/" + contactId[0]).set({
			"x-access-token": userToken
		}).expect(200);
	});

	test("Should not be able to update name and email of the first created contact", async () => {
		await request(app).put("/contact/" + contactId[0]).send({
			name: "Contact Updated Example",
			email: "contact.updated@example.com"
		}).set({
			"x-access-token": userToken
		}).expect(404);
	});

	test("Should not be able to delete first created contact", async () => {
		await request(app).delete("/contact/" + contactId[0]).set({
			"x-access-token": userToken
		}).expect(404);
	});

	test("Should be able to delete user", async () => {
		await request(app).delete("/user").set({
			"x-access-token": userToken,
			password: "password"
		}).expect(200);
	});

	test("Should not be able to get second created contact", async () => {
		await request(app).get("/contact/" + contactId[1]).set({
			"x-access-token": userToken
		}).expect(404);
	});
});