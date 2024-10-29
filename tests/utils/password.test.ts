import bcrypt from "bcrypt";
import { hashPassword, checkPassword } from "../../src/utils/password.util";

jest.mock("bcrypt");

describe("hashPassword", () => {
  it("should hash the received password", async () => {
    (bcrypt.hashSync as jest.Mock).mockReturnValue("passwordHash");

    expect(hashPassword("password")).toBe("passwordHash");

    (bcrypt.hashSync as jest.Mock).mockReturnValue(undefined);

    expect(hashPassword("password")).toBe(undefined);
  });
});

describe("checkPassword", () => {
  it("should compare the received hash with the received password hash", async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    expect(await checkPassword("password", "passwordHash")).toBe(true);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    expect(await checkPassword("password", "passwordHash")).toBe(false);
  });
});
