import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../lib/auth/jwt';
import { Role } from '@prisma/client';

/**
 * GET /api/admin/categories
 * List all categories for admin
 */
export async function GET(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const categories = await prisma.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { services: true } },
      },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

/**
 * POST /api/admin/categories
 * Create a new Service Category
 */
export async function POST(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { name, description, icon, sortOrder } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await prisma.serviceCategory.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        icon: icon || 'Wrench',
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Kategori dengan nama atau slug ini sudah ada' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
