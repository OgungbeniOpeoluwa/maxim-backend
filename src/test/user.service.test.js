const userRepository = require("../repository/user.repository");
const UserService = require("../services/user.service");
const createUserDto = require("../dto/request/createUser.request.dto");
const updateUserDto = require("../dto/request/updateUserDto");


jest.mock("../repository/user.repository", () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findByVirtualAccount: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
}));


jest.mock("../util/util", () => {
    const actual = jest.requireActual("../util/util");
    return {
      ...actual,
      hashedPassword: jest.fn((p) => Promise.resolve("hashed-" + p)),
    };
  });

  
describe("UserService (unit)", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  it("should return null if user not found by email", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const user = await userService.getUserByEmail("notfound@mail.com");

    expect(user).toBeNull();
    expect(userRepository.findByEmail).toHaveBeenCalledWith("notfound@mail.com");
  });

  it("should create user successfully", async () => {
    const dto = new createUserDto({
      firstName: "shade",
      lastName: "shola",
      email: "shola@gmail.com",
      password: "ope123",
    });

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.createUser.mockResolvedValue({
      _id: "123",
      firstName: "shade",
      lastName: "shola",
      email: "shola@gmail.com",
      password: "hashed-ope123",
    });

    const user = await userService.createUser(dto);

    expect(userRepository.findByEmail).toHaveBeenCalledWith("shola@gmail.com");
    expect(userRepository.createUser).toHaveBeenCalled();
    expect(user).toHaveProperty("id", "123");
    expect(user.password).toBeUndefined(); // password removed by mapUser
  });

  it("should throw if user already exists", async () => {
    const dto = new createUserDto({
      firstName: "shade",
      lastName: "shola",
      email: "exists@gmail.com",
      password: "ope123",
    });

    userRepository.findByEmail.mockResolvedValue({ id: "1", email: "exists@gmail.com" });

    await expect(userService.createUser(dto)).rejects.toThrow("Email already exists");
  });

  it("should update user successfully", async () => {
    userRepository.findById.mockResolvedValue({ id: "1", email: "test@mail.com" });
    userRepository.updateUser.mockResolvedValue({
      _id: "1",
      firstName: "tolu",
      lastName: "shola",
      email: "test@mail.com",
    });

    const dto = new updateUserDto({ id: "1", firstName: "tolu" });

    const updated = await userService.updateUser(dto);

    expect(userRepository.findById).toHaveBeenCalledWith("1");
    expect(userRepository.updateUser).toHaveBeenCalledWith("1", dto);
    expect(updated.firstName).toBe("tolu");
  });

  describe("createUser validation", () => {
    it("should throw error if email is missing", async () => {
      const dto = new createUserDto({
        firstName: "shade",
        lastName: "shola",
        password: "ope123",
      });

      await expect(userService.createUser(dto)).rejects.toThrow("Email is required");
    });

    it("should throw error if password is missing", async () => {
      const dto = new createUserDto({
        firstName: "shade",
        lastName: "shola",
        email: "shola@gmail.com",
      });

      await expect(userService.createUser(dto)).rejects.toThrow("Password is required");
    });

    it("should throw error if firstName is missing", async () => {
      const dto = new createUserDto({
        lastName: "shola",
        email: "shola@gmail.com",
        password: "ope123",
      });

      await expect(userService.createUser(dto)).rejects.toThrow("First name is required");
    });

    it("should throw error if lastName is missing", async () => {
      const dto = new createUserDto({
        firstName: "shade",
        email: "shola@gmail.com",
        password: "ope123",
      });

      await expect(userService.createUser(dto)).rejects.toThrow("Last name is required");
    });
  });
});
