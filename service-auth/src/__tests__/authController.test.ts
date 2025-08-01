import { Request, Response } from "express";
import { AuthController } from "../controllers/authController";

// Mock Firebase Admin
jest.mock("../config/firebase", () => ({
  auth: {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    createCustomToken: jest.fn(),
    verifyIdToken: jest.fn(),
    getUser: jest.fn(),
  },
}));

describe("AuthController", () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    authController = new AuthController();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
  });

  describe("signup", () => {
    it("should return 400 when email and password are missing", async () => {
      await authController.signup(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Email and password are required",
        error: "Missing required fields",
      });
    });
  });

  describe("login", () => {
    it("should return 400 when email and password are missing", async () => {
      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Email and password are required",
        error: "Missing required fields",
      });
    });
  });

  describe("validateToken", () => {
    it("should return 400 when token is missing", async () => {
      await authController.validateToken(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Token is required",
        error: "Missing token",
      });
    });
  });
});
