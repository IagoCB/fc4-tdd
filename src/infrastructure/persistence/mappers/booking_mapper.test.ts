import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { UserEntity } from "../entities/user_entity";
import { BookingMapper } from "./booking_mapper";
import { PropertyMapper } from "./property_mapper";
import { UserMapper } from "./user_mapper";

jest.mock("./property_mapper");
jest.mock("./user_mapper");

describe("BookingMapper", () => {
  let mockBookingEntity: BookingEntity;
  let mockPropertyEntity: PropertyEntity;
  let mockUserEntity: UserEntity;
  let mockProperty: Property;
  let mockUser: User;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPropertyEntity = new PropertyEntity();
    mockPropertyEntity.id = "property-id";
    mockPropertyEntity.name = "House";

    mockUserEntity = new UserEntity();
    mockUserEntity.id = "user-id";
    mockUserEntity.name = "Iago";

    mockBookingEntity = new BookingEntity();
    mockBookingEntity.id = "booking-id";
    mockBookingEntity.property = mockPropertyEntity;
    mockBookingEntity.guest = mockUserEntity;
    mockBookingEntity.startDate = new Date("2025-05-01");
    mockBookingEntity.endDate = new Date("2025-05-05");
    mockBookingEntity.guestCount = 2;
    mockBookingEntity.totalPrice = 1000;
    mockBookingEntity.status = "CONFIRMED";

    mockProperty = new Property("property-id", "House", "Description", 4, 100);
    mockUser = new User("user-id", "Iago");

    (PropertyMapper.toDomain as jest.Mock).mockReturnValue(mockProperty);
    (UserMapper.toDomain as jest.Mock).mockReturnValue(mockUser);
    (PropertyMapper.toPersistence as jest.Mock).mockReturnValue(
      mockPropertyEntity
    );
    (UserMapper.toPersistence as jest.Mock).mockReturnValue(mockUserEntity);
  });

  it("deve converter BookingEntity em Booking corretamente", () => {
    const result = BookingMapper.toDomain(mockBookingEntity);

    expect(result).toBeInstanceOf(Booking);
    expect(result.getId()).toBe("booking-id");
    expect(result.getProperty()).toBe(mockProperty);
    expect(result.getGuest()).toBe(mockUser);
    expect(result.getDateRange()).toBeInstanceOf(DateRange);
    expect(result.getDateRange().getStartDate()).toEqual(
      new Date("2025-05-01")
    );
    expect(result.getDateRange().getEndDate()).toEqual(new Date("2025-05-05"));
    expect(result.getGuestCount()).toBe(2);
    expect(result.getTotalPrice()).toBe(1000);
    expect(result.getStatus()).toBe("CONFIRMED");

    expect(UserMapper.toDomain).toHaveBeenCalledWith(mockUserEntity);
    expect(PropertyMapper.toDomain).toHaveBeenCalledWith(mockPropertyEntity);
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
    const invalidEntity1 = new BookingEntity();

    const invalidEntity2 = new BookingEntity();
    invalidEntity2.id = "booking-id";
    invalidEntity2.guest = mockUserEntity;

    const invalidEntity3 = new BookingEntity();
    invalidEntity3.id = "booking-id";
    invalidEntity3.property = mockPropertyEntity;
    invalidEntity3.guest = mockUserEntity;

    expect(() => BookingMapper.toDomain(invalidEntity1)).toThrow();
    expect(() => BookingMapper.toDomain(invalidEntity2)).toThrow();
    expect(() => BookingMapper.toDomain(invalidEntity3)).toThrow();
  });

  it("deve converter Booking para BookingEntity corretamente", () => {
    const dateRange = new DateRange(
      new Date("2025-05-01"),
      new Date("2025-05-05")
    );
    const booking = new Booking(
      "booking-id",
      mockProperty,
      mockUser,
      dateRange,
      2
    );

    (booking as any)["totalPrice"] = 1000;
    (booking as any)["status"] = "confirmed";

    const result = BookingMapper.toPersistence(booking);

    expect(result).toBeInstanceOf(BookingEntity);
    expect(result.id).toBe("booking-id");
    expect(result.property).toBe(mockPropertyEntity);
    expect(result.guest).toBe(mockUserEntity);
    expect(result.startDate).toEqual(new Date("2025-05-01"));
    expect(result.endDate).toEqual(new Date("2025-05-05"));
    expect(result.guestCount).toBe(2);
    expect(result.totalPrice).toBe(1000);
    expect(result.status).toBe("confirmed");

    expect(PropertyMapper.toPersistence).toHaveBeenCalledWith(mockProperty);
    expect(UserMapper.toPersistence).toHaveBeenCalledWith(mockUser);
  });
});
