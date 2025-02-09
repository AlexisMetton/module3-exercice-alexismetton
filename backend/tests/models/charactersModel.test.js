const Character = require("../../models/characterModel");
const pool = require("../../config/db");

jest.mock("../../config/db");

describe("Character Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getAllCharacters should return all characters", async () => {
    const mockCharacters = [{ id: 1, name: "Test", class_ID: 2, role_ID: 3, ilvl: 100, rio: 500 }];
    pool.query.mockResolvedValue({ rows: mockCharacters });

    const characters = await Character.getAllCharacters();
    expect(characters).toEqual(mockCharacters);
  });

  test("createCharacter should insert and return the new character", async () => {
    const newCharacter = { name: "Test", class_ID: 2, role_ID: 3, ilvl: 100, rio: 500 };
    pool.query.mockResolvedValue({ rows: [{ id: 1, ...newCharacter }] });

    const result = await Character.createCharacter(newCharacter);
    expect(result).toEqual({ id: 1, ...newCharacter });
  });

  test("updateCharacter should modify an existing character", async () => {
    const updatedCharacter = { id: 1, name: "Updated", class_ID: 2, role_ID: 3, ilvl: 120, rio: 600 };
    pool.query.mockResolvedValue({ rows: [updatedCharacter] });

    const result = await Character.updateCharacter(1, updatedCharacter);
    expect(result).toEqual(updatedCharacter);
  });

  test("deleteCharacter should remove and return the deleted character", async () => {
    const deletedCharacter = { id: 1, name: "Deleted", class_ID: 2, role_ID: 3, ilvl: 90, rio: 400 };
    pool.query.mockResolvedValue({ rows: [deletedCharacter] });

    const result = await Character.deleteCharacter(1);
    expect(result).toEqual(deletedCharacter);
  });

  test("getCharacterById should return the requested character", async () => {
    const mockCharacter = { id: 1, name: "Test", class_ID: 2, role_ID: 3, ilvl: 100, rio: 500 };
    pool.query.mockResolvedValue({ rows: [mockCharacter] });

    const result = await Character.getCharacterById(1);
    expect(result).toEqual(mockCharacter);
  });
});
