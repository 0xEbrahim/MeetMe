import "reflect-metadata";
import request from "supertest";
import app from "../../../../infrastructure/api/app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { IRedisRepository } from "../../../../infrastructure/redis/Repositories/IRedisRepository";
import RedisRepository from "../../../../infrastructure/redis/Repositories/RedisRepository";

let mongoServer: MongoMemoryServer;
let redisRepo: IRedisRepository;
beforeAll(async () => {
  redisRepo = new RedisRepository();
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "test-db" });
});

afterEach(async () => {});
afterAll(async () => {
  const collections = await mongoose.connection.db!.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
  await mongoose.disconnect();
  await mongoServer.stop();
  await redisRepo.disconnect();
});
const registerUserData = [
  {
    name: "Mohamed",
    email: "mohamed@gmail.com",
    password: "123456789",
  },
  {
    name: "Khaled",
    email: "Khaled@gmail.com",
    password: "123456789",
  },
  {
    name: "Ebrahim",
    email: "Ebrahim@gmail.com",
    password: "123456789",
  },
  {
    name: "Waleed",
    email: "Waleed@gmail.com",
    password: "123456789",
  },
];

describe("POST /signup", () => {
  describe("name, email and password provided", () => {
    it("Should Register a new user.", async () => {
      for (let user of registerUserData) {
        const response = await request(app)
          .post("/api/v1/users/signup")
          .send(user);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Operation completed successfully");
        expect(response.body.data.user).toHaveProperty("email");
        expect(response.body.data.user.email).toEqual(user.email);
      }
    }, 15000);

    it("Should not register due to existing email", async () => {
      for (let user of registerUserData) {
        const response = await request(app)
          .post("/api/v1/users/signup")
          .send(user);
        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe("Email already exists.");
        expect(response.body.status).toBe("ERROR");
      }
    }, 15000);
  });
});
