import jwt from "jsonwebtoken";
import { generateToken, verifyToken } from "../../src/utils/jwt.util";

jest.mock("jsonwebtoken");

describe("generateToken", () => {
  it("should generate a jwt", () => {
    (jwt.sign as jest.Mock).mockReturnValue("foo_jwt");

    expect(generateToken({ id: 1 })).toBe("foo_jwt");
  });
});

describe("verifyToken", () => {
  it("should format the received token if prefixed with 'Bearier '", () => {
    verifyToken("Bearer foo_jwt");

    expect(jwt.verify).toHaveBeenCalledWith("foo_jwt", process.env.JWT_SECRET);
  });

  it("should not format the received token if not prefixed with 'Bearier '", () => {
    verifyToken("foo_jwt");

    expect(jwt.verify).toHaveBeenCalledWith("foo_jwt", process.env.JWT_SECRET);
  });

  it("should return the decoded value if the token is verified", () => {
    (jwt.verify as jest.Mock).mockReturnValue("decoded_value");

    expect(verifyToken("foo_jwt")).toBe("decoded_value");
  });

  it("should return null if the token is not verified", () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("foo");
    });

    expect(verifyToken("foo_jwt")).toBeNull;
  });
});
