const AuthService = require("../services/auth.service");
const errorMessage = require("../util/errormessage.util");
const jwt = require("jsonwebtoken");

jest.mock("../util/util", () => ({
  comparePassword: jest.fn(),
}));
const { comparePassword } = require("../util/util");

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

const mockUserService = {
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
};

const mockConfig = {
  AccessTokenSecret: "test_secret",
};

describe("AuthService", () => {
  let authService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(mockUserService, mockConfig);
  });

  describe("login", () => {
    it("should throw error if user does not exist", async () => {
      mockUserService.getUserByEmail.mockResolvedValue(null);

      await expect(authService.login("missing@mail.com", "password"))
        .rejects
        .toThrow("missing@mail.com " + errorMessage.ERROR_DOESNT_EXISTS);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith("missing@mail.com");
    });

    it("should throw error if password is invalid", async () => {
      const fakeUser = { id: 1, email: "john@mail.com", password: "hashedpass" };
      mockUserService.getUserByEmail.mockResolvedValue(fakeUser);

      comparePassword.mockResolvedValue(false);

      await expect(authService.login(fakeUser.email, "wrongpass"))
        .rejects
        .toThrow(errorMessage.ERROR_INVALID_PASSWORD);

      expect(comparePassword).toHaveBeenCalledWith(fakeUser.password, "wrongpass");
    });

    it("should return JWT token if credentials are correct", async () => {
      const fakeUser = { id: 1, email: "john@mail.com", password: "hashedpass" };
      mockUserService.getUserByEmail.mockResolvedValue(fakeUser);

      comparePassword.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fake.jwt.token");

      const token = await authService.login(fakeUser.email, "correctpass");

      expect(comparePassword).toHaveBeenCalledWith(fakeUser.password, "correctpass");
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: fakeUser.id, email: fakeUser.email },
        mockConfig.AccessTokenSecret
      );
      expect(token).toBe("fake.jwt.token");
    });
  });



  describe("registerUser", () => {
    it("should call userService.createUser and return the created user", async () => {
      const mockDto = { firstName: "John", email: "john@example.com" };
      const mockUser = { id: 1, ...mockDto };

      mockUserService.createUser.mockResolvedValue(mockUser);

      const result = await authService.registerUser(mockDto);

      expect(mockUserService.createUser).toHaveBeenCalledWith(mockDto);
      expect(result).toEqual(mockUser);
    });
  });


  
  describe("verifyToken", () => {
    it("should return decoded token if valid", async () => {
      const fakeToken = "valid.token";
      const decoded = { id: 1, email: "john@example.com" };

      jwt.verify.mockReturnValue(decoded);

      const result = await authService.verifyToken(fakeToken);

      expect(jwt.verify).toHaveBeenCalledWith(fakeToken, mockConfig.AccessTokenSecret);
      expect(result).toEqual(decoded);
    });

    it("should throw error if token is invalid", async () => {
      const fakeToken = "invalid.token";

      jwt.verify.mockImplementation(() => {
        throw new Error("invalid");
      });

      await expect(authService.verifyToken(fakeToken))
        .rejects
        .toThrow(errorMessage.ERROR_INVALID_TOKEN);
    });
  });
});
