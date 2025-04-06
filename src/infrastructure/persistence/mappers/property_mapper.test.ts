import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";

describe("PropertyMapper", () => {
  const validPropertyEntity = () => {
    const entity = new PropertyEntity();
    entity.id = "property-id";
    entity.name = "House";
    entity.description = "Description";
    entity.maxGuests = 4;
    entity.basePricePerNight = 150;
    return entity;
  };

  it("deve converter PropertyEntity em Property corretamente", () => {
    const propertyEntity = validPropertyEntity();

    const result = PropertyMapper.toDomain(propertyEntity);

    expect(result).toBeInstanceOf(Property);
    expect(result.getId()).toBe("property-id");
    expect(result.getName()).toBe("House");
    expect(result.getDescription()).toBe("Description");
    expect(result.getMaxGuests()).toBe(4);
    expect(result.getBasePricePerNight()).toBe(150);
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
    const emptyEntity = new PropertyEntity();

    const missingNameEntity = new PropertyEntity();
    missingNameEntity.id = "property-id";
    missingNameEntity.description = "Description";
    missingNameEntity.maxGuests = 4;
    missingNameEntity.basePricePerNight = 150;

    const missingMaxGuestsEntity = new PropertyEntity();
    missingMaxGuestsEntity.id = "property-id";
    missingMaxGuestsEntity.name = "House";
    missingMaxGuestsEntity.description = "Description";
    missingMaxGuestsEntity.basePricePerNight = 150;

    expect(() => PropertyMapper.toDomain(emptyEntity)).toThrow();
    expect(() => PropertyMapper.toDomain(missingNameEntity)).toThrow();
    expect(() => PropertyMapper.toDomain(missingMaxGuestsEntity)).toThrow();
  });

  it("deve converter Property para PropertyEntity corretamente", () => {
    const property = new Property(
      "property-id",
      "House",
      "Description",
      4,
      150
    );

    const result = PropertyMapper.toPersistence(property);

    expect(result).toBeInstanceOf(PropertyEntity);
    expect(result.id).toBe("property-id");
    expect(result.name).toBe("House");
    expect(result.description).toBe("Description");
    expect(result.maxGuests).toBe(4);
    expect(result.basePricePerNight).toBe(150);
  });
});
