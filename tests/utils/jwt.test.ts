import jwt from "jsonwebtoken";
import {
  generateToken,
  parseToken,
  refreshToken,
  verifyToken,
} from "../../src/utils/jwt.util";

jest.mock("jsonwebtoken");

describe("generateToken", () => {
  it("should generate a jwt", () => {
    (jwt.sign as jest.Mock).mockReturnValue("foo_jwt");

    expect(generateToken({ id: 1 })).toBe("foo_jwt");
  });
});

describe("verifyToken", () => {
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

describe("refreshToken", () => {
  it("should decode the received token and generate a new one", () => {
    (jwt.decode as jest.Mock).mockReturnValue("decoded");
    (jwt.sign as jest.Mock).mockReturnValue("new_token");

    const newToken = refreshToken("old_token");

    expect(newToken).toBe("new_token");
  });

  it("should return nothing the received token can not be decoded", () => {
    (jwt.decode as jest.Mock).mockReturnValue(undefined);

    const newToken = refreshToken("old_token");

    expect(newToken).toBeUndefined();
  });
});

describe("parseToken", () => {
  it("should remove any 'Bearier ' prefix from the received token", () => {
    expect(parseToken("Bearer foo-token")).toBe("foo-token");
    expect(parseToken("foo-token")).toBe("foo-token");
  });
});
