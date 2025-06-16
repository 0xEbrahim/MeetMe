import "reflect-metadata";
import request from "supertest";
import app from "../../../../infrastructure/api/app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { IRedisRepository } from "../../../../infrastructure/redis/Repositories/IRedisRepository";
import RedisRepository from "../../../../infrastructure/redis/Repositories/RedisRepository";

let mongoServer: MongoMemoryServer;
let redisRepo: IRedisRepository;
let validJWT: string;
beforeAll(async () => {
  redisRepo = new RedisRepository();
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "test-db" });
});
beforeEach(async () => {
  let response = await request(app).post("/api/v1/users/signup").send({
    name: "Mohamed",
    email: "sosos@gmail.com",
    password: "123456789",
  });
  response = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "sosos@gmail.com", password: "123456789" });
  validJWT = "Bearer " + response.body.token;
});
afterEach(async () => {
  const collections = await mongoose.connection.db!.collections();
  await redisRepo.flush();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await redisRepo.flush();
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
const users = Array.from({ length: 20 }, (_, i) => ({
  name: `User${i + 1}`,
  email: `user${i + 1}@example.com`,
  password: `password${i + 1}`,
}));

const userData = {
  name: "Ebrahim",
  email: "Ebrahim@gmail.com",
  password: "123456789",
};

const nonExistUserId = `684befce36a20aa01b12ef2f`;

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
      let response = await request(app)
        .post("/api/v1/users/signup")
        .send(userData);
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("Operation completed successfully");
      expect(response.body.data.user).toHaveProperty("email");
      expect(response.body.data.user.email).toEqual(userData.email);
      response = await request(app).post("/api/v1/users/signup").send(userData);
      expect(response.statusCode).toBe(409);
      expect(response.body.status).toBe("ERROR");
      expect(response.body.message).toBe("Email already exists.");
    }, 15000);
  });
});

describe("DELETE /:id", () => {
  it("Should Delete the user", async () => {
    const data = await request(app).post("/api/v1/users/signup").send(userData);
    let find = await request(app)
      .get(`/api/v1/users/${data.body.data.user._id}`)
      .set("authorization", validJWT);
    expect(find.statusCode).toBe(200);
    expect(find.body.status).toBe("SUCCESS");
    expect(find.body.message).toBe("Operation completed successfully");
    expect(find.body.data.user.email).toEqual(userData.email);
    const response = await request(app)
      .delete(`/api/v1/users/${data.body.data.user._id}`)
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("result");
    find = await request(app)
      .get(`/api/v1/users/${data.body.data.user._id}`)
      .set("authorization", validJWT);
    expect(find.statusCode).toBe(404);
    expect(find.body.status).toBe("ERROR");
    expect(find.body.message).toBe(
      `User with id: ${data.body.data.user._id} not found.`
    );
  }, 15000);

  it("Should return error not found", async () => {
    const response = await request(app)
      .delete(`/api/v1/users/${nonExistUserId}`)
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("ERROR");
    expect(response.body.message).toBe(
      `User with id: ${nonExistUserId} not found.`
    );
  }, 15000);
});

describe("GET /:id", () => {
  it(`Should return user reponse 200`, async () => {
    const data = await request(app).post("/api/v1/users/signup").send(userData);
    const response = await request(app)
      .get(`/api/v1/users/${data.body.data.user._id}`)
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("SUCCESS");
    expect(response.body.message).toBe("Operation completed successfully");
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data.user.email).toEqual(userData.email);
  }, 15000);

  it("Should return error not found", async () => {
    const response = await request(app)
      .get(`/api/v1/users/${nonExistUserId}`)
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("ERROR");
    expect(response.body.message).toBe(
      `User with id: ${nonExistUserId} not found.`
    );
  }, 15000);
});

describe("GET /", () => {
  it("Should retrieve all the documents", async () => {
    for (let user of registerUserData) {
      await request(app).post("/api/v1/users/signup").send(user);
    }
    const response = await request(app)
      .get("/api/v1/users")
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("SUCCESS");
    expect(response.body.message).toBe("Operation completed successfully");
    expect(response.body.data).toHaveProperty("users");
    expect(response.body.data.users.length).toEqual(
      registerUserData.length + 1
    );
  }, 15000);

  it("Should return due to the query parameter", async () => {
    for (let user of users) {
      await request(app).post("/api/v1/users/signup").send(user);
    }
    let response = await request(app)
      .get("/api/v1/users")
      .query({
        limit: 1,
      })
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("SUCCESS");
    expect(response.body.message).toBe("Operation completed successfully");
    expect(response.body.data).toHaveProperty("users");
    expect(response.body.data.users.length).toBe(1);
    response = await request(app)
      .get("/api/v1/users")
      .set("authorization", validJWT)
      .query({
        limit: 5,
        page: 2,
        fields: "name,email",
      });
    expect(response.body.data.users.length).toBeLessThanOrEqual(5);
    response.body.data.users.forEach((user: any) => {
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("email");
      // expect(Object.keys(user)).not.toContain("password");
    });
  }, 15000);
});
