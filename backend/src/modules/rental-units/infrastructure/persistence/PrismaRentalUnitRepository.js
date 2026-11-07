import { prisma } from '../../../../core/database/index.js';
import { IRentalUnitRepository } from '../../domain/repositories/IRentalUnitRepository.js';

export class PrismaRentalUnitRepository extends IRentalUnitRepository {
  /**
   * Create a new rental unit under a property
   */
  async create(data) {
    return prisma.rentalUnit.create({
      data: {
        propertyId: data.propertyId,
        unitNumber: data.unitNumber,
        floor: data.floor !== undefined ? data.floor : null,
        unitType: data.unitType,
        baseRentAmount: data.baseRentAmount,
        occupancyStatus: data.occupancyStatus || 'VACANT',
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });
  }

  /**
   * Find unit by unique ID with property, active tenancy, and electricity meter
   */
  async findById(id) {
    return prisma.rentalUnit.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            addressLine1: true,
            city: true,
            stateProvince: true,
            postalCode: true,
          },
        },
        electricityMeter: {
          select: {
            id: true,
            meterNumber: true,
            status: true,
            initialReading: true,
          },
        },
        tenancyAgreements: {
          where: {
            status: { in: ['ACTIVE', 'NOTICE_PERIOD'] },
          },
          select: {
            id: true,
            agreementNumber: true,
            startDate: true,
            endDate: true,
            monthlyRentAmount: true,
            fixedWaterCharge: true,
            status: true,
            primaryTenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
          take: 1,
        },
        _count: {
          select: {
            tenancyAgreements: true,
          },
        },
      },
    });
  }

  /**
   * Find unit by propertyId and unitNumber
   */
  async findByPropertyAndUnitNumber(propertyId, unitNumber) {
    return prisma.rentalUnit.findUnique({
      where: {
        uq_property_unit: {
          propertyId,
          unitNumber,
        },
      },
    });
  }

  /**
   * Find multiple units with filtering, search, pagination, and sorting
   */
  async findMany({
    propertyId,
    unitType,
    occupancyStatus,
    search,
    floor,
    page = 1,
    limit = 10,
    sortBy = 'unitNumber',
    sortOrder = 'asc',
  }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (unitType) {
      where.unitType = { equals: unitType, mode: 'insensitive' };
    }

    if (occupancyStatus) {
      where.occupancyStatus = occupancyStatus;
    }

    if (floor !== undefined && floor !== null) {
      where.floor = floor;
    }

    if (search && search.trim()) {
      const query = search.trim();
      where.OR = [
        { unitNumber: { contains: query, mode: 'insensitive' } },
        { unitType: { contains: query, mode: 'insensitive' } },
        { property: { name: { contains: query, mode: 'insensitive' } } },
      ];
    }

    // Build orderBy
    let orderByClause;
    if (sortBy === 'propertyName') {
      orderByClause = { property: { name: sortOrder } };
    } else {
      orderByClause = { [sortBy]: sortOrder };
    }

    const [items, total] = await Promise.all([
      prisma.rentalUnit.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderByClause,
        include: {
          property: {
            select: {
              id: true,
              name: true,
              city: true,
            },
          },
          tenancyAgreements: {
            where: {
              status: { in: ['ACTIVE', 'NOTICE_PERIOD'] },
            },
            select: {
              id: true,
              agreementNumber: true,
              primaryTenant: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            take: 1,
          },
        },
      }),
      prisma.rentalUnit.count({ where }),
    ]);

    const formatted = items.map((unit) => {
      const activeTenancy = unit.tenancyAgreements?.[0] || null;
      return {
        id: unit.id,
        propertyId: unit.propertyId,
        propertyName: unit.property?.name,
        propertyCity: unit.property?.city,
        unitNumber: unit.unitNumber,
        floor: unit.floor,
        unitType: unit.unitType,
        baseRentAmount: unit.baseRentAmount,
        occupancyStatus: unit.occupancyStatus,
        activeTenancy: activeTenancy
          ? {
              id: activeTenancy.id,
              agreementNumber: activeTenancy.agreementNumber,
              tenantName: `${activeTenancy.primaryTenant?.firstName || ''} ${activeTenancy.primaryTenant?.lastName || ''}`.trim(),
            }
          : null,
        createdAt: unit.createdAt,
        updatedAt: unit.updatedAt,
      };
    });

    return {
      items: formatted,
      total,
      page,
      limit,
    };
  }

  /**
   * Update rental unit
   */
  async update(id, data) {
    return prisma.rentalUnit.update({
      where: { id },
      data: {
        ...(data.unitNumber !== undefined && { unitNumber: data.unitNumber }),
        ...(data.floor !== undefined && { floor: data.floor }),
        ...(data.unitType !== undefined && { unitType: data.unitType }),
        ...(data.baseRentAmount !== undefined && { baseRentAmount: data.baseRentAmount }),
        ...(data.occupancyStatus !== undefined && { occupancyStatus: data.occupancyStatus }),
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });
  }

  /**
   * Delete rental unit
   */
  async delete(id) {
    return prisma.rentalUnit.delete({
      where: { id },
    });
  }

  /**
   * Get active tenancy for unit
   */
  async getActiveTenancy(unitId) {
    return prisma.tenancyAgreement.findFirst({
      where: {
        rentalUnitId: unitId,
        status: { in: ['ACTIVE', 'NOTICE_PERIOD'] },
      },
    });
  }

  /**
   * Aggregate statistics for units across system or per property
   */
  async getUnitStats(propertyId = null) {
    const where = propertyId ? { propertyId } : {};

    const [total, grouped] = await Promise.all([
      prisma.rentalUnit.count({ where }),
      prisma.rentalUnit.groupBy({
        by: ['occupancyStatus'],
        where,
        _count: {
          id: true,
        },
      }),
    ]);

    let occupied = 0;
    let vacant = 0;
    let maintenance = 0;
    let inactive = 0;

    for (const item of grouped) {
      const count = item._count.id;
      if (item.occupancyStatus === 'OCCUPIED') occupied = count;
      else if (item.occupancyStatus === 'VACANT') vacant = count;
      else if (item.occupancyStatus === 'MAINTENANCE') maintenance = count;
      else if (item.occupancyStatus === 'INACTIVE') inactive = count;
    }

    return {
      total,
      occupied,
      vacant,
      maintenance,
      inactive,
      occupancyRate: total > 0 ? Number(((occupied / total) * 100).toFixed(1)) : 0,
    };
  }
}

