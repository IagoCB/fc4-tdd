import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { PropertyService } from "../../application/services/property_service";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { TypeORMBookingRepository } from "../repositories/typeorm_booking_repository";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { PropertyController } from "./property_controller";
import { UserEntity } from "../persistence/entities/user_entity";
import { UserService } from "../../application/services/user_service";
import { BookingService } from "../../application/services/booking_service";

const app = express();
app.use(express.json());

let propertyController: PropertyController;
let bookingService: BookingService;
let propertyService: PropertyService;
let userService: UserService;
let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let bookingRepository: TypeORMBookingRepository;
let userRepository: TypeORMUserRepository;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [PropertyEntity, BookingEntity, UserEntity],
        synchronize: true,
        logging: false,
    });

    await dataSource.initialize();

    propertyRepository = new TypeORMPropertyRepository(
        dataSource.getRepository(PropertyEntity)
    );
    bookingRepository = new TypeORMBookingRepository(
        dataSource.getRepository(BookingEntity)
    );
    userRepository = new TypeORMUserRepository(
        dataSource.getRepository(UserEntity)
    );

    propertyService = new PropertyService(propertyRepository);
    userService = new UserService(userRepository);
    bookingService = new BookingService(
        bookingRepository,
        propertyService,
        userService
    );
    propertyController = new PropertyController(propertyService);

    app.post("/properties", (req, res, next) => {
        propertyController.createProperty(req, res).catch((err) => next(err));
    });
});

afterAll(async () => {
    if (dataSource.isInitialized) {
        await dataSource.destroy();
    }
});

describe("PropertyController E2E Tests", () => {
    it("deve criar uma propriedade com sucesso", async () => {
        const propertyData = {
            name: "Casa na praia",
            description: "Linda casa com vista para o mar",
            maxGuests: 4,
            basePricePerNight: 100
        };

        const response = await request(app)
            .post("/properties")
            .send(propertyData)
            .expect(201);

        expect(response.body.message).toBe("Property created successfully");
    });

    it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
        const propertyData = {
            name: "",
            description: "Linda casa com vista para o mar",
            maxGuests: 4,
            basePricePerNight: 100
        };

        const response = await request(app)
            .post("/properties")
            .send(propertyData)
            .expect(400);

        expect(response.body.message).toBe("O nome da propriedade é obrigatório.");
    });

    it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
        const propertyDataZero = {
            name: "Casa na praia",
            description: "Linda casa com vista para o mar",
            maxGuests: 0,
            basePricePerNight: 100
        };

        const responseZero = await request(app)
            .post("/properties")
            .send(propertyDataZero)
            .expect(400);

        expect(responseZero.body.message).toBe("A capacidade máxima deve ser maior que zero.");

        const propertyDataNegative = {
            name: "Casa na praia",
            description: "Linda casa com vista para o mar",
            maxGuests: -2,
            basePricePerNight: 100
        };

        const responseNegative = await request(app)
            .post("/properties")
            .send(propertyDataNegative)
            .expect(400);

        expect(responseNegative.body.message).toBe("A capacidade máxima deve ser maior que zero.");
    });

    it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
        const propertyData = {
            name: "Casa na praia",
            description: "Linda casa com vista para o mar",
            maxGuests: 4
        };

        const response = await request(app)
            .post("/properties")
            .send(propertyData)
            .expect(400);

        expect(response.body.message).toBe("O preço base por noite é obrigatório.");
    });
});