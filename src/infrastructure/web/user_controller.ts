import { Request, Response } from "express";
import { UserService } from "../../application/services/user_service";
import { CreateUserDTO } from "../../application/dtos/create_user_dto";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const userData: CreateUserDTO = {
        name: req.body.name,
      };

      await this.userService.createUser(userData);

      return res.status(201).json({
        message: "User created successfully",
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "An unexpected error occurred" });
    }
  }
}
