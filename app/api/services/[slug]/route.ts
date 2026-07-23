import { NextRequest, NextResponse } from 'next/server';
import { getServiceBySlug } from '../../../../lib/services/serviceCatalogService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const service = await getServiceBySlug(slug);

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      service,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch service detail' }, { status: 500 });
  }
}
