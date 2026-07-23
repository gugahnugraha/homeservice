import prisma from '../prisma';
import { PriceModel } from '@prisma/client';

export interface FormattedService {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  priceModel: PriceModel;
  priceFormatted: string;
  priceModelBadge: string;
  durationMinutes: number;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
}

export interface FormattedCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  servicesCount: number;
}

// Fallback Mock Data for Development when DB is not running
const MOCK_CATEGORIES: FormattedCategory[] = [
  { id: 'cat-1', name: 'Pembersihan Rumah', slug: 'cleaning', description: 'Pembersihan harian, deep cleaning, cuci sofa & kasur', icon: 'Sparkles', sortOrder: 1, servicesCount: 3 },
  { id: 'cat-2', name: 'Perbaikan Pipa & Ledeng', slug: 'plumbing', description: 'Keran bocor, pipa mampet, instalasi toilet & wastafel', icon: 'Droplets', sortOrder: 2, servicesCount: 3 },
  { id: 'cat-3', name: 'Kelistrikan & Instalasi', slug: 'electrical', description: 'Stopkontak, konsleting listrik, instalasi lampu & wiring', icon: 'Zap', sortOrder: 3, servicesCount: 3 },
  { id: 'cat-4', name: 'Servis AC & Pendingin', slug: 'ac-service', description: 'Cuci AC, isi freon, perbaikan AC & bongkar pasang', icon: 'Wind', sortOrder: 4, servicesCount: 2 },
  { id: 'cat-5', name: 'Perbaikan Elektronik', slug: 'appliances', description: 'Mesin cuci, kulkas, dispenser & alat rumah tangga', icon: 'Wrench', sortOrder: 5, servicesCount: 2 },
  { id: 'cat-6', name: 'Taman & Eksterior', slug: 'garden', description: 'Potong rumput, pemangkasan pohon & perawatan taman', icon: 'Trees', sortOrder: 6, servicesCount: 1 },
  { id: 'cat-7', name: 'Pest Control', slug: 'pest-control', description: 'Pembasmian rayap, kecoak, tikus & fogging nyamuk', icon: 'Bug', sortOrder: 7, servicesCount: 1 },
  { id: 'cat-8', name: 'Renovasi & Pertukangan', slug: 'home-improvement', description: 'Pengecatan dinding, perakitan furnitur & perbaikan pintu', icon: 'Paintbrush', sortOrder: 8, servicesCount: 2 },
];

const MOCK_SERVICES: FormattedService[] = [
  {
    id: 'srv-1',
    name: 'Cuci AC Rutin & Maintenance',
    slug: 'cuci-ac-rutin',
    description: 'Pembersihan unit indoor dan outdoor AC menggunakan mesin jet washer bertekanan tinggi.',
    basePrice: 90000,
    priceModel: PriceModel.FIXED_PRICE,
    priceFormatted: 'Rp 90.000',
    priceModelBadge: 'Harga Pas',
    durationMinutes: 60,
    categoryId: 'cat-4',
    categoryName: 'Servis AC & Pendingin',
    categorySlug: 'ac-service',
  },
  {
    id: 'srv-2',
    name: 'Perbaikan Keran Bocor & Wastafel',
    slug: 'perbaikan-keran-bocor',
    description: 'Penanganan kebocoran keran, penggantian seal, instalasi kran baru, dan perbaikan wastafel.',
    basePrice: 150000,
    priceModel: PriceModel.STARTING_FROM,
    priceFormatted: 'Mulai Rp 150.000',
    priceModelBadge: 'Mulai Dari',
    durationMinutes: 45,
    categoryId: 'cat-2',
    categoryName: 'Perbaikan Pipa & Ledeng',
    categorySlug: 'plumbing',
  },
  {
    id: 'srv-3',
    name: 'Full House Deep Cleaning',
    slug: 'deep-cleaning-rumah',
    description: 'Pembersihan menyeluruh seluruh ruangan rumah termasuk penyedotan debu dan disinfeksi.',
    basePrice: 75000,
    priceModel: PriceModel.HOURLY,
    priceFormatted: 'Rp 75.000 / jam',
    priceModelBadge: 'Per Jam',
    durationMinutes: 120,
    categoryId: 'cat-1',
    categoryName: 'Pembersihan Rumah',
    categorySlug: 'cleaning',
  },
  {
    id: 'srv-4',
    name: 'Pemeriksaan & Perbaikan Konsleting Listrik',
    slug: 'perbaikan-konsleting-listrik',
    description: 'Deteksi titik korslet pada MCB atau jalur kabel tersembunyi menggunakan multitester.',
    basePrice: 120000,
    priceModel: PriceModel.STARTING_FROM,
    priceFormatted: 'Mulai Rp 120.000',
    priceModelBadge: 'Mulai Dari',
    durationMinutes: 60,
    categoryId: 'cat-3',
    categoryName: 'Kelistrikan & Instalasi',
    categorySlug: 'electrical',
  },
  {
    id: 'srv-5',
    name: 'Layanan Pembasmian Rayap Bangunan',
    slug: 'basmi-rayap',
    description: 'Injeksi tanah dan penyemprotan bahan kimia termitisida bergaransi resmi.',
    basePrice: 0,
    priceModel: PriceModel.QUOTATION,
    priceFormatted: 'Estimasi / Survei',
    priceModelBadge: 'Survei Gratis',
    durationMinutes: 180,
    categoryId: 'cat-7',
    categoryName: 'Pest Control',
    categorySlug: 'pest-control',
  },
];

export function formatPriceModel(model: PriceModel, price: number): { formattedPrice: string; badgeLabel: string } {
  switch (model) {
    case PriceModel.FIXED_PRICE:
      return { formattedPrice: `Rp ${price.toLocaleString('id-ID')}`, badgeLabel: 'Harga Pas' };
    case PriceModel.STARTING_FROM:
      return { formattedPrice: `Mulai Rp ${price.toLocaleString('id-ID')}`, badgeLabel: 'Mulai Dari' };
    case PriceModel.HOURLY:
      return { formattedPrice: `Rp ${price.toLocaleString('id-ID')} / jam`, badgeLabel: 'Per Jam' };
    case PriceModel.QUOTATION:
      return { formattedPrice: 'Memerlukan Survei / Estimasi', badgeLabel: 'Survei' };
    case PriceModel.CUSTOM_PRICE:
      return { formattedPrice: `Penawaran Mitra (Mulai Rp ${price.toLocaleString('id-ID')})`, badgeLabel: 'Tarif Kustom' };
    default:
      return { formattedPrice: `Rp ${price.toLocaleString('id-ID')}`, badgeLabel: 'Harga Pas' };
  }
}

/**
 * Fetch all categories with services count
 */
export async function getCategories(): Promise<FormattedCategory[]> {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { services: true },
        },
      },
    });

    if (categories.length > 0) {
      return categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.icon,
        sortOrder: c.sortOrder,
        servicesCount: c._count.services,
      }));
    }
  } catch (error) {
    // Database fallback
  }

  return MOCK_CATEGORIES;
}

/**
 * Fetch services with optional category slug & search query filtering
 */
export async function getServices(categorySlug?: string, query?: string): Promise<FormattedService[]> {
  try {
    const where: any = { isActive: true };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    if (services.length > 0) {
      return services.map((s) => {
        const { formattedPrice, badgeLabel } = formatPriceModel(s.priceModel, s.basePrice);
        return {
          id: s.id,
          name: s.name,
          slug: s.slug,
          description: s.description,
          basePrice: s.basePrice,
          priceModel: s.priceModel,
          priceFormatted: formattedPrice,
          priceModelBadge: badgeLabel,
          durationMinutes: s.durationMinutes,
          categoryId: s.categoryId,
          categoryName: s.category.name,
          categorySlug: s.category.slug,
        };
      });
    }
  } catch (error) {
    // Database fallback
  }

  let filtered = [...MOCK_SERVICES];
  if (categorySlug) {
    filtered = filtered.filter((s) => s.categorySlug === categorySlug);
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter((s) => s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q)));
  }

  return filtered;
}

/**
 * Fetch single service by slug
 */
export async function getServiceBySlug(slug: string): Promise<FormattedService | null> {
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    if (service) {
      const { formattedPrice, badgeLabel } = formatPriceModel(service.priceModel, service.basePrice);
      return {
        id: service.id,
        name: service.name,
        slug: service.slug,
        description: service.description,
        basePrice: service.basePrice,
        priceModel: service.priceModel,
        priceFormatted: formattedPrice,
        priceModelBadge: badgeLabel,
        durationMinutes: service.durationMinutes,
        categoryId: service.categoryId,
        categoryName: service.category.name,
        categorySlug: service.category.slug,
      };
    }
  } catch (error) {
    // Database fallback
  }

  const mock = MOCK_SERVICES.find((s) => s.slug === slug);
  return mock || null;
}
