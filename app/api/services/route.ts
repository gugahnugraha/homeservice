import { NextRequest, NextResponse } from 'next/server';
import { getServices } from '../../../lib/services/serviceCatalogService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category') || undefined;
    const query = searchParams.get('q') || undefined;

    const services = await getServices(categorySlug, query);
    return NextResponse.json({
      success: true,
      services,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
