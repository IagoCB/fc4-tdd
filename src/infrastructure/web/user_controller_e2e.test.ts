import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { UserService } from "../../application/services/user_service";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { UserController } from "./user_controller";

const app = express();
app.use(express.json());

let userController: UserController;
let userService: UserService;
let dataSource: DataSource;
let userRepository: TypeORMUserRepository;

beforeEach(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  userRepository = new TypeORMUserRepository(
    dataSource.getRepository(UserEntity)
  );
  userService = new UserService(userRepository);
  userController = new UserController(userService);

  app.post("/users", (req, res, next) => {
    userController.createUser(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
});

describe("UserController E2E Tests", () => {
  it("deve criar um usuário com sucesso", async () => {
    const userData = {
      name: "Iago",
    };

    const response = await request(app)
      .post("/users")
      .send(userData)
      .expect(201);

    expect(response.body.message).toBe("User created successfully");
  });

  it('deve retornar erro com código 400 e mensagem "O campo nome é obrigatório." ao enviar um nome vazio', async () => {
    const userData = {
      name: "",
    };

    const response = await request(app)
      .post("/users")
      .send(userData)
      .expect(400);

    expect(response.body.message).toBe("O campo nome é obrigatório.");
  });
});
