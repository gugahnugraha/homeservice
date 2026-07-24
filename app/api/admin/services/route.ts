import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../lib/auth/jwt';
import { PriceModel, Role } from '@prisma/client';

/**
 * GET /api/admin/services
 * List all services for admin with category breakdown
 */
export async function GET(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, services });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

/**
 * POST /api/admin/services
 * Create a new Service
 */
export async function POST(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { categoryId, name, description, basePrice, priceModel, durationMinutes } = await request.json();

    if (!categoryId || !name || !basePrice) {
      return NextResponse.json({ error: 'Category, Name, and Base Price are required' }, { status: 400 });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const service = await prisma.service.create({
      data: {
        categoryId,
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        basePrice: parseFloat(basePrice),
        priceModel: priceModel && Object.values(PriceModel).includes(priceModel) ? priceModel : PriceModel.FIXED_PRICE,
        durationMinutes: durationMinutes ? parseInt(durationMinutes) : 60,
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Layanan dengan nama atau slug ini sudah ada' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
