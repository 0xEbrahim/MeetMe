import request from "supertest";
import app from "../../../../infrastructure/api/app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { IRedisRepository } from "../../../../infrastructure/redis/Repositories/IRedisRepository";
import RedisRepository from "../../../../infrastructure/redis/Repositories/RedisRepository";
import mongoose from "mongoose";
import env from "../../../../shared/constant/env";

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

const createRoom = async () => {
  const data = await request(app)
    .post("/api/v1/rooms")
    .set("authorization", validJWT)
    .send(validRoom);
  return data.body.data.room;
};

const validRoom = { name: "Facebook", max_participants: 20 };
const invalidRoom = { max_participants: 20 };
const invalidRoomId = "684dfa040b3246815f1b6d18";
const invalidRoomCode = "EAF7091D";
const mockedRooms = [
  {
    name: "Facebook",
    max_participants: 20,
  },
  { name: "Whatsapp", max_participants: 10 },
  {
    name: "LinkedIn",
    max_participants: 20,
  },
  { name: "Twitter", max_participants: 20 },
  {
    name: "Instagram",
    max_participants: 20,
  },
];
describe("POST /", () => {
  it("Should create a room successfully", async () => {
    const response = await request(app)
      .post("/api/v1/rooms")
      .set("authorization", validJWT)
      .send(validRoom);
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("SUCCESS");
    expect(response.body.message).toBe("Operation completed successfully");
    expect(response.body.data).toHaveProperty("room");
    expect(response.body.data.room.name).toBe(validRoom.name);
  });

  it("Should return a validation error, missing required parameter", async () => {
    const response = await request(app)
      .post("/api/v1/rooms")
      .set("authorization", validJWT)
      .send(invalidRoom);
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("ERROR");
    expect(response.body.message).toBe('Validation error: Required at "name"');
  });
});

describe("GET /:id", () => {
  it("Should return a room with roomID", async () => {
    const data = await request(app)
      .post("/api/v1/rooms")
      .set("authorization", validJWT)
      .send(validRoom);
    const response = await request(app)
      .get(`/api/v1/rooms/${data.body.data.room._id.toString()}`)
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("SUCCESS");
    expect(response.body.data).toHaveProperty("room");
    expect(response.body.data.room.room_code).toEqual(
      data.body.data.room.room_code
    );
  });

  it("Should return not found 404 error", async () => {
    const response = await request(app)
      .get(`/api/v1/rooms/${invalidRoomId}`)
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("ERROR");
    expect(response.body.message).toBe(
      `Room with id: ${invalidRoomId} not found.`
    );
  });
});

describe("POST /join/:room_code", () => {
  it("Should Join the room successfully", async () => {
    const room = await createRoom();
    const response = await request(app)
      .post(`/api/v1/rooms/join/${room.room_code}`)
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("SUCCESS");
    expect(response.body.data).toHaveProperty("room");
    expect(response.body.data.room.roomId).toEqual(room._id.toString());
  });

  it("Should return room already joined error", async () => {
    const room = await createRoom();
    await request(app)
      .post(`/api/v1/rooms/join/${room.room_code}`)
      .set("authorization", validJWT);
    const response = await request(app)
      .post(`/api/v1/rooms/join/${room.room_code}`)
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "You have already joined this room before."
    );
  });
});

describe("GET /", () => {
  it("Should retrieve all rooms", async () => {
    for (let room of mockedRooms) {
      await request(app)
        .post("/api/v1/rooms/")
        .set("authorization", validJWT)
        .send(room);
    }
    const response = await request(app)
      .get("/api/v1/rooms")
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.rooms.length).toBe(mockedRooms.length);
  });

  it("Should retrieve number based on the limit & page", async () => {
    for (let room of mockedRooms) {
      await request(app)
        .post("/api/v1/rooms/")
        .set("authorization", validJWT)
        .send(room);
    }
    let response = await request(app)
      .get("/api/v1/rooms")
      .set("authorization", validJWT)
      .query({
        limit: 1,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.rooms.length).toBeLessThanOrEqual(1);
    response = await request(app)
      .get("/api/v1/rooms")
      .set("authorization", validJWT)
      .query({
        limit: 2,
        page: 2,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.rooms.length).toBeLessThanOrEqual(2);
  });
});

describe("GET /code/:room_code", () => {
  it("Should return the room due to a valid room code", async () => {
    const room = await createRoom();
    const response = await request(app)
      .get(`/api/v1/rooms/code/${room.room_code}`)
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("room");
    expect(response.body.data.room.name).toEqual(validRoom.name);
    expect(response.body.data.room.max_participants).toEqual(
      validRoom.max_participants
    );
  });

  it("Should return not found error", async () => {
    const response = await request(app)
      .get(`/api/v1/rooms/code/${invalidRoomCode}`)
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("ERROR");
    expect(response.body.message).toBe(
      `Room with id: ${invalidRoomCode} not found.`
    );
  });
});

describe("PUT /:id", () => {
  it("Should be updated", async () => {
    const room = await createRoom();
    const response = await request(app)
      .put(`/api/v1/rooms/${room._id.toString()}`)
      .set("authorization", validJWT)
      .send({ name: "Bro is broo" });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("SUCCESS");
    expect(response.body.data).toHaveProperty("room");
    expect(response.body.data.room.name).toBe("Bro is broo");
  });

  it("Should throw not found error", async () => {
    const response = await request(app)
      .put(`/api/v1/rooms/${invalidRoomId}`)
      .set("authorization", validJWT)
      .send({ name: "Bro is broo" });
    expect(response.statusCode).toBe(404);
  });
});

describe("DELETE /:id", () => {
  it("Should delete the room", async () => {
    const room = await createRoom();
    let find = await request(app)
      .get(`/api/v1/rooms/${room._id.toString()}`)
      .set("authorization", validJWT);
    expect(find.statusCode).toBe(200);
    await request(app)
      .delete(`/api/v1/rooms/${room._id.toString()}`)
      .set("authorization", validJWT);
    find = await request(app)
      .get(`/api/v1/rooms/${room._id.toString()}`)
      .set("authorization", validJWT);
    expect(find.statusCode).toBe(404);
  });
  it("Should throw not found error", async () => {
    const response = await request(app)
      .delete(`/api/v1/rooms/${invalidRoomId}`)
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(404);
  });
});

describe("GET /api/v1/users/me/rooms", () => {
  it("Should return all the rooms that the user created", async () => {
    for (let room of mockedRooms) {
      await request(app)
        .post("/api/v1/rooms")
        .set("authorization", validJWT)
        .send(room);
    }
    const response = await request(app)
      .get("/api/v1/users/me/rooms")
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.rooms.length).toEqual(mockedRooms.length);
  });
});
describe("GET /active", () => {
  it("Should return active rooms for the user", async () => {
    const rooms = [];
    for (let room of mockedRooms) {
      const data = await request(app)
        .post("/api/v1/rooms/")
        .set("authorization", validJWT)
        .send(room);
      rooms.push(data.body.data.room);
    }
    let response = await request(app)
      .get("/api/v1/rooms/active")
      .set("authorization", validJWT);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("rooms");
    expect(response.body.data.rooms.length).toEqual(rooms.length);
    const r = await request(app)
      .put(`/api/v1/rooms/${rooms[0]._id.toString()}`)
      .set("authorization", validJWT)
      .send({ is_active: false });
    response = await request(app)
      .get("/api/v1/rooms/active")
      .set("authorization", validJWT);
    expect(response.body.data.rooms.length).toEqual(rooms.length - 1);
  });
});
