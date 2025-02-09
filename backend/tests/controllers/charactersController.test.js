const request = require("supertest");
const app = require("../../app");
const Character = require("../../models/characterModel");

jest.mock("../../models/characterModel");

describe("Character Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /characters should return all characters", async () => {
    const mockCharacters = [{ id: 1, name: "Test", class_ID: 2, role_ID: 3, ilvl: 100, rio: 500 }];
    Character.getAllCharacters.mockResolvedValue(mockCharacters);

    const response = await request(app).get("/characters");
    expect(response.status).toBe(200);
    expect(response.body.characters).toEqual(mockCharacters);
  });

  test("POST /characters should create a new character", async () => {
    const newCharacter = { name: "Test", class_ID: 2, role_ID: 3, ilvl: 100, rio: 500 };
    Character.createCharacter.mockResolvedValue({ id: 1, ...newCharacter });

    const response = await request(app).post("/characters").send(newCharacter);
    expect(response.status).toBe(201);
    expect(response.body.character).toEqual({ id: 1, ...newCharacter });
  });

  test("PUT /characters/:id should update an existing character", async () => {
    const updatedCharacter = { id: 1, name: "Updated", class_ID: 2, role_ID: 3, ilvl: 120, rio: 600 };
    Character.updateCharacter.mockResolvedValue(updatedCharacter);

    const response = await request(app).put("/characters/1").send(updatedCharacter);
    expect(response.status).toBe(200);
    expect(response.body.character).toEqual(updatedCharacter);
  });

  test("DELETE /characters/:id should remove a character", async () => {
    Character.deleteCharacter.mockResolvedValue(true);

    const response = await request(app).delete("/characters/1");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Personnage supprimé.");
  });

  test("GET /characters/:id should return a character", async () => {
    const mockCharacter = { id: 1, name: "Test", class_ID: 2, role_ID: 3, ilvl: 100, rio: 500 };
    Character.getCharacterById.mockResolvedValue(mockCharacter);

    const response = await request(app).get("/characters/1");
    expect(response.status).toBe(200);
    expect(response.body.character).toEqual(mockCharacter);
  });
});
