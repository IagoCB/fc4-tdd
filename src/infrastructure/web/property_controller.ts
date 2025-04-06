import { Request, Response } from "express";
import { PropertyService } from "../../application/services/property_service";
import { CreatePropertyDTO } from "../../application/dtos/create_property_dto";

export class PropertyController {
    private propertyService: PropertyService;

    constructor(propertyService: PropertyService) {
        this.propertyService = propertyService;
    }

    async createProperty(req: Request, res: Response): Promise<Response> {
        try {
            const propertyData: CreatePropertyDTO = {
                name: req.body.name,
                description: req.body.description || '',
                maxGuests: Number(req.body.maxGuests),
                basePricePerNight: Number(req.body.basePricePerNight)
            };

            await this.propertyService.createProperty(propertyData);

            return res.status(201).json({
                message: "Property created successfully",
            });
        } catch (error: any) {
            return res
                .status(400)
                .json({ message: error.message || "An unexpected error occurred" });
        }
    }
}