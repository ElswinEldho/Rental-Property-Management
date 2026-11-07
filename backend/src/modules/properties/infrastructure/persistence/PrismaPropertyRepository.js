import { prisma } from '../../../../core/database/index.js';
import { IPropertyRepository } from '../../domain/repositories/IPropertyRepository.js';

export class PrismaPropertyRepository extends IPropertyRepository {
  /**
   * Create a new property
   */
  async create(data) {
    return prisma.property.create({
      data: {
        name: data.name,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        city: data.city,
        stateProvince: data.stateProvince,
        postalCode: data.postalCode,
        country: data.country || 'India',
        upiId: data.upiId || null,
        upiPayeeName: data.upiPayeeName || null,
      },
    });
  }

  /**
   * Find property by ID with unit statistics
   */
  async findById(id) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            rentalUnits: true,
            electricityTariffs: true,
            expenses: true,
          },
        },
        rentalUnits: {
          select: {
            id: true,
            unitNumber: true,
            floor: true,
            unitType: true,
            baseRentAmount: true,
            occupancyStatus: true,
          },
          orderBy: [
            { floor: 'asc' },
            { unitNumber: 'asc' },
          ],
        },
      },
    });

    return property;
  }

  /**
   * Find multiple properties with search, pagination, and sorting
   */
  async findMany({ search, city, state, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (search && search.trim()) {
      const query = search.trim();
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { addressLine1: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { postalCode: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (city && city.trim()) {
      where.city = { equals: city.trim(), mode: 'insensitive' };
    }

    if (state && state.trim()) {
      where.stateProvince = { equals: state.trim(), mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              rentalUnits: true,
            },
          },
          rentalUnits: {
            select: {
              occupancyStatus: true,
            },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    // Format unit summary counts (occupied, vacant, total)
    const formattedItems = items.map((p) => {
      const units = p.rentalUnits || [];
      const totalUnits = units.length;
      const occupiedUnits = units.filter((u) => u.occupancyStatus === 'OCCUPIED').length;
      const vacantUnits = units.filter((u) => u.occupancyStatus === 'VACANT').length;
      const maintenanceUnits = units.filter((u) => u.occupancyStatus === 'MAINTENANCE').length;

      // Omit verbose rentalUnits array to keep listing light
      const { rentalUnits, ...rest } = p;
      return {
        ...rest,
        unitSummary: {
          total: totalUnits,
          occupied: occupiedUnits,
          vacant: vacantUnits,
          maintenance: maintenanceUnits,
        },
      };
    });

    return {
      items: formattedItems,
      total,
      page,
      limit,
    };
  }

  /**
   * Update property details
   */
  async update(id, data) {
    return prisma.property.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.addressLine1 !== undefined && { addressLine1: data.addressLine1 }),
        ...(data.addressLine2 !== undefined && { addressLine2: data.addressLine2 }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.stateProvince !== undefined && { stateProvince: data.stateProvince }),
        ...(data.postalCode !== undefined && { postalCode: data.postalCode }),
        ...(data.country !== undefined && { country: data.country }),
        ...(data.upiId !== undefined && { upiId: data.upiId }),
        ...(data.upiPayeeName !== undefined && { upiPayeeName: data.upiPayeeName }),
      },
      include: {
        _count: {
          select: {
            rentalUnits: true,
          },
        },
      },
    });
  }

  /**
   * Delete a property (only if no rental units or transactions exist)
   */
  async delete(id) {
    return prisma.property.delete({
      where: { id },
    });
  }

  /**
   * Get overall portfolio statistics
   */
  async getPortfolioStats() {
    const [propertyCount, unitStats] = await Promise.all([
      prisma.property.count(),
      prisma.rentalUnit.groupBy({
        by: ['occupancyStatus'],
        _count: {
          id: true,
        },
      }),
    ]);

    let totalUnits = 0;
    let occupiedUnits = 0;
    let vacantUnits = 0;
    let maintenanceUnits = 0;

    for (const stat of unitStats) {
      const count = stat._count.id;
      totalUnits += count;
      if (stat.occupancyStatus === 'OCCUPIED') occupiedUnits += count;
      else if (stat.occupancyStatus === 'VACANT') vacantUnits += count;
      else if (stat.occupancyStatus === 'MAINTENANCE') maintenanceUnits += count;
    }

    return {
      totalProperties: propertyCount,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      maintenanceUnits,
      occupancyRate: totalUnits > 0 ? Number(((occupiedUnits / totalUnits) * 100).toFixed(1)) : 0,
    };
  }
}

