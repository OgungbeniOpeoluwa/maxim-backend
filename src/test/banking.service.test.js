const axios = require("axios");
const generateToken = require("../util/generateToken");
const constants = require("../util/constant.util");
const errorMessage = require("../util/errormessage.util");
const BankingService = require("../services/banking.service");

jest.mock("axios");
jest.mock("../util/generateToken");

describe("BankingService (unit tests, mocks)", () => {
  let mockUserService;
  let config;
  let bankingService;

  beforeEach(() => {
    jest.clearAllMocks();

    config = {
      CompanyUrl: "https://company.test",
      SafeHavenClientID: "test-client-id",
      SafeHavenBaseUrl: "https://safehaven.test",
      SafeHavenGrantType: "client_credentials",
      SafeHavenAssertionType: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      AccountValidity: "3600",
      SettlementAccountNumber: "1234567890",
      SettlementBankCode: "001",
      SafeHavenAmountControl: true,
      CallBackUrl: "https://callback.test",
    };

    mockUserService = {
      getUserById: jest.fn(),
      updateUserWithVirtualAccountnumber: jest.fn(),
    };

    bankingService = new BankingService(config, mockUserService);
    process.env.PRIVATE_KEY = "FAKE_PRIVATE_KEY";
    process.env.SAVE_HAVEN_EXPIRY_DATE = ""; 
  });


  it("generates client assertion JWT (calls generateToken)", async () => {
    generateToken.mockReturnValue("mocked-jwt-token");
    const token = await bankingService.generateClientAssertion();

    expect(generateToken).toHaveBeenCalled();
    expect(token).toBe("mocked-jwt-token");
  });

  it("reuses cached client assertion when expiry is sufficiently far in the future", async () => {
    generateToken.mockReturnValue("mocked-jwt-1");
    const first = await bankingService.generateClientAssertion();

    bankingService.cachedAssertionExpiry = Math.floor(Date.now() / 1000) + 600;

    const second = await bankingService.generateClientAssertion();

    expect(first).toBe("mocked-jwt-1");
    expect(second).toBe("mocked-jwt-1");
    expect(generateToken).toHaveBeenCalledTimes(1);
  });

  it("regenerates client assertion when expiry is too near (or passed)", async () => {
    generateToken.mockReturnValueOnce("mocked-jwt-1");
    const first = await bankingService.generateClientAssertion();

    bankingService.cachedAssertionExpiry = Math.floor(Date.now() / 1000) + 30;

    generateToken.mockReturnValueOnce("mocked-jwt-2");
    const second = await bankingService.generateClientAssertion();

    expect(first).toBe("mocked-jwt-1");
    expect(second).toBe("mocked-jwt-2");
    expect(generateToken).toHaveBeenCalledTimes(2);
  });



  it("fetches access token from SafeHaven and sets IbsClientId", async () => {
    generateToken.mockReturnValue("mocked-assertion");
    axios.post.mockResolvedValue({
      data: { access_token: "mocked-access-token", ibs_client_id: "mock-ibs-client", expires_in: 3600 },
    });

    const token = await bankingService.getToken();

    expect(token).toBe("mocked-access-token");
    expect(bankingService.IbsClientId).toBe("mock-ibs-client");
    expect(axios.post).toHaveBeenCalledWith(
      config.SafeHavenBaseUrl + constants.SAFE_HAVEN_REFRESH_GENERATE_TOKEN_URL,
      expect.any(Object)
    );
  });

  it("reuses cached access token when still valid", async () => {
    bankingService.accessToken = "cached-token";
    bankingService.tokenExpiry = Math.floor(Date.now() / 1000) + 500;

    const token = await bankingService.getToken();

    expect(token).toBe("cached-token");
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("throws when fetching token fails", async () => {
    generateToken.mockReturnValue("mocked-assertion");
    axios.post.mockRejectedValue(new Error("network error"));

    await expect(bankingService.getToken()).rejects.toThrow(/failed to get token/);
  });


  it("creates virtual account successfully and updates user", async () => {
    bankingService.accessToken = "mock-access-token";
    bankingService.tokenExpiry = Math.floor(Date.now() / 1000) + 500;
    bankingService.IbsClientId = "mock-ibs-client";

    mockUserService.getUserById.mockResolvedValue({ id: "user1" });

    axios.post.mockResolvedValue({
      data: { data: { accountNumber: "VA12345" } },
    });

    mockUserService.updateUserWithVirtualAccountnumber.mockResolvedValue({
      id: "user1",
      virtualAccountNumber: "VA12345",
    });

    const accountNumber = await bankingService.createVirtualAccount("user1");

    expect(accountNumber).toBe("VA12345");
    expect(mockUserService.getUserById).toHaveBeenCalledWith("user1");
    expect(mockUserService.updateUserWithVirtualAccountnumber).toHaveBeenCalledWith("VA12345", "user1");
    expect(axios.post).toHaveBeenCalledWith(
      config.SafeHavenBaseUrl + constants.CREATE_VIRTUAL_ACCOUNT_URL,
      expect.any(Object),
      expect.objectContaining({
        headers: expect.objectContaining({
          ClientID: bankingService.IbsClientId,
          Authorization: expect.stringContaining("mock-access-token"),
        }),
      })
    );
  });

  it("throws when user already has a virtual account", async () => {
    bankingService.accessToken = "mock-access-token";
    bankingService.tokenExpiry = Math.floor(Date.now() / 1000) + 500;
    bankingService.IbsClientId = "mock-ibs-client";

    mockUserService.getUserById.mockResolvedValue({
      id: "user1",
      virtualAccountNumber: "VA999",
    });

    await expect(bankingService.createVirtualAccount("user1")).rejects.toThrow(
      `virtual account ${errorMessage.ERROR_EXIST} for user`
    );
  });

  it("throws when account creation API fails (createVirtualAccount)", async () => {
    bankingService.getToken = jest.fn().mockResolvedValue("mocked-token");
    bankingService.IbsClientId = "mocked-client";

    mockUserService.getUserById.mockResolvedValue({ id: "user1" });

    axios.post.mockRejectedValue(new Error("network error"));

    await expect(bankingService.createVirtualAccount("user1")).rejects.toThrow(
      /failed to create virtual account/
    );
  });
});
