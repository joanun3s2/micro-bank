import { Request, Response } from "express";
import { auth } from "../config/firebase";
import {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  TokenValidationRequest,
  TokenValidationResponse,
} from "../types/auth";
import { getAuth, signInWithCustomToken } from "firebase/auth";

export class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, displayName }: SignupRequest = req.body;

      if (!email || !password) {
        const response: AuthResponse = {
          success: false,
          message: "Email and password are required",
          error: "Missing required fields",
        };
        res.status(400).json(response);
        return;
      }

      const userRecord = await auth.createUser({
        email,
        password,
        displayName,
      });

      const response: AuthResponse = {
        success: true,
        message: "User created successfully",
        data: {
          uid: userRecord.uid,
          email: userRecord.email!,
          displayName: userRecord.displayName || undefined,
        },
      };

      res.status(201).json(response);
    } catch (error: any) {
      const response: AuthResponse = {
        success: false,
        message: "Failed to create user",
        error: error.message,
      };
      res.status(500).json(response);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        const response: AuthResponse = {
          success: false,
          message: "Email and password are required",
          error: "Missing required fields",
        };
        res.status(400).json(response);
        return;
      }

      const userRecord = await auth.getUserByEmail(email);

      const customToken = await auth.createCustomToken(userRecord.uid);

      // TODO: The custom token is not what we want but the idToken
      // Actually it is not working to validate the token for that reason so it must be fixed
      const authMethod = getAuth();
      const result = await signInWithCustomToken(authMethod, customToken);
      const idToken = await result.user.getIdToken();

      const response: AuthResponse = {
        success: true,
        message: "Login successful",
        data: {
          uid: userRecord.uid,
          email: userRecord.email!,
          displayName: userRecord.displayName || undefined,
          token: customToken,
        },
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: AuthResponse = {
        success: false,
        message: "Login failed",
        error: error.message,
      };
      res.status(401).json(response);
    }
  }

  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const { token }: TokenValidationRequest = req.body;

      if (!token) {
        const response: TokenValidationResponse = {
          success: false,
          message: "Token is required",
          error: "Missing token",
        };
        res.status(400).json(response);
        return;
      }

      const decodedToken = await auth.verifyIdToken(token);
      const userRecord = await auth.getUser(decodedToken.uid);

      const response: TokenValidationResponse = {
        success: true,
        message: "Token is valid",
        data: {
          uid: userRecord.uid,
          email: userRecord.email!,
          displayName: userRecord.displayName || undefined,
        },
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: TokenValidationResponse = {
        success: false,
        message: "Token validation failed",
        error: error.message,
      };
      res.status(401).json(response);
    }
  }
}
