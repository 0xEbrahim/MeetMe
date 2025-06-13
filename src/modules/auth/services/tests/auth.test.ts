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

afterEach(async () => {
  const collections = await mongoose.connection.db!.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await redisRepo.disconnect();
});

const user = {
  name: "Ebrahim",
  email: "ebrahim@gmail.com",
  password: "123456789",
};

describe("POST /login", () => {
  it("Should be a successful login, 200", async () => {
    await request(app).post("/api/v1/users/signup").send(user);
    const response = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("SUCCESS");
    expect(response.body.message).toBe("Operation completed successfully");
    expect(response.body.data).toHaveProperty("accessToken");
    expect(response.body.data).toHaveProperty("user");
  });

  it("Should throw error wrong email or password", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("ERROR");
    expect(response.body.message).toBe("Invalid email or password.");
  });
});
