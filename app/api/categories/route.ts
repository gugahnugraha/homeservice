import { NextResponse } from 'next/server';
import { getCategories } from '../../../lib/services/serviceCatalogService';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
