import { PrismaClient, PriceModel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Home Services Marketplace Catalog Seeding...');

  // 1. Service Categories
  const categories = [
    {
      name: 'Pembersihan Rumah',
      slug: 'cleaning',
      description: 'Layanan pembersihan rumah harian, deep cleaning, cuci sofa, karpet, dan kamar mandi.',
      icon: 'Sparkles',
      sortOrder: 1,
    },
    {
      name: 'Perbaikan Pipa & Ledeng',
      slug: 'plumbing',
      description: 'Perbaikan keran bocor, saluran mampet, instalasi toilet, wastafel, dan kran air.',
      icon: 'Droplets',
      sortOrder: 2,
    },
    {
      name: 'Kelistrikan & Instalasi',
      slug: 'electrical',
      description: 'Pemasangan stopkontak, sakelar, perbaikan konsleting listrik, dan instalasi lampu.',
      icon: 'Zap',
      sortOrder: 3,
    },
    {
      name: 'Servis AC & Pendingin',
      slug: 'ac-service',
      description: 'Cuci AC rutin, tambah/isi freon, perbaikan AC tidak dingin, dan bongkar pasang unit.',
      icon: 'Wind',
      sortOrder: 4,
    },
    {
      name: 'Perbaikan Elektronik Rumah',
      slug: 'appliances',
      description: 'Servis mesin cuci, kulkas, dispenser air, microwave, dan alat elektronik rumah tangga.',
      icon: 'Wrench',
      sortOrder: 5,
    },
    {
      name: 'Taman & Eksterior',
      slug: 'garden',
      description: 'Pemotongan rumput, perawatan tanaman, pembersihan halaman, dan pemangkasan pohon.',
      icon: 'Trees',
      sortOrder: 6,
    },
    {
      name: 'Pengendalian Hama (Pest Control)',
      slug: 'pest-control',
      description: 'Pembasmian rayap, kecoak, tikus, nyamuk, dan pengasapan/fogging lingkungan.',
      icon: 'Bug',
      sortOrder: 7,
    },
    {
      name: 'Renovasi & Pertukangan',
      slug: 'home-improvement',
      description: 'Pengecatan dinding, perakitan furnitur, perbaikan pintu/jendela, dan renovasi ringan.',
      icon: 'Paintbrush',
      sortOrder: 8,
    },
  ];

  for (const cat of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // Fetch created categories
  const catMap = new Map();
  const allCategories = await prisma.serviceCategory.findMany();
  allCategories.forEach((c) => catMap.set(c.slug, c.id));

  // 2. Dynamic Services with 5 Pricing Models
  const services = [
    // Pembersihan
    {
      categoryId: catMap.get('cleaning'),
      name: 'Cuci AC Rutin & Maintenance',
      slug: 'cuci-ac-rutin',
      description: 'Pembersihan unit indoor dan outdoor AC menggunakan mesin jet washer bertekanan tinggi.',
      basePrice: 90000,
      priceModel: PriceModel.FIXED_PRICE,
      durationMinutes: 60,
      sortOrder: 1,
    },
    {
      categoryId: catMap.get('cleaning'),
      name: 'Full House Deep Cleaning',
      slug: 'deep-cleaning-rumah',
      description: 'Pembersihan menyeluruh seluruh ruangan rumah termasuk penyedotan debu dan disinfeksi.',
      basePrice: 75000,
      priceModel: PriceModel.HOURLY,
      durationMinutes: 120,
      sortOrder: 2,
    },
    {
      categoryId: catMap.get('cleaning'),
      name: 'Cuci Sofa & Kasur Busa/Springbed',
      slug: 'cuci-sofa-kasur',
      description: 'Pembersihan noda dan pencucian basah sofa/kasur menggunakan ekstraktor anti tungau.',
      basePrice: 150000,
      priceModel: PriceModel.STARTING_FROM,
      durationMinutes: 90,
      sortOrder: 3,
    },

    // Plumbing
    {
      categoryId: catMap.get('plumbing'),
      name: 'Perbaikan Keran Bocor & Wastafel',
      slug: 'perbaikan-keran-bocor',
      description: 'Penanganan kebocoran keran, penggantian seal, instalasi kran baru, dan perbaikan wastafel.',
      basePrice: 150000,
      priceModel: PriceModel.FIXED_PRICE,
      durationMinutes: 45,
      sortOrder: 1,
    },
    {
      categoryId: catMap.get('plumbing'),
      name: 'Pembersihan Saluran Air Mampet',
      slug: 'saluran-air-mampet',
      description: 'Pembersihan pipa tersumbat dengan alat kawat spiral khusus tanpa membongkar lantai.',
      basePrice: 200000,
      priceModel: PriceModel.STARTING_FROM,
      durationMinutes: 90,
      sortOrder: 2,
    },
    {
      categoryId: catMap.get('plumbing'),
      name: 'Pemasangan Toilet Duduk / Jongkok New',
      slug: 'pasang-toilet-baru',
      description: 'Instalasi kloset baru termasuk pembongkaran kloset lama dan perapihan nut semen.',
      basePrice: 350000,
      priceModel: PriceModel.FIXED_PRICE,
      durationMinutes: 120,
      sortOrder: 3,
    },

    // Electrical
    {
      categoryId: catMap.get('electrical'),
      name: 'Pemasangan Stopkontak & Sakelar Lampu',
      slug: 'pasang-stopkontak-sakelar',
      description: 'Instalasi titik stopkontak baru, penggantian sakelar rusak, dan perapihan klem kabel.',
      basePrice: 75000,
      priceModel: PriceModel.FIXED_PRICE,
      durationMinutes: 45,
      sortOrder: 1,
    },
    {
      categoryId: catMap.get('electrical'),
      name: 'Pemeriksaan & Perbaikan Konsleting Listrik',
      slug: 'perbaikan-konsleting-listrik',
      description: 'Deteksi titik korslet pada MCB atau jalur kabel tersembunyi menggunakan multitester.',
      basePrice: 120000,
      priceModel: PriceModel.STARTING_FROM,
      durationMinutes: 60,
      sortOrder: 2,
    },
    {
      categoryId: catMap.get('electrical'),
      name: 'Instalasi Wiring Ulang Listrik Rumah',
      slug: 'wiring-ulang-listrik',
      description: 'Pengerjaan ulang instalasi listrik seluruh rumah sesuai standar PLN. Memerlukan survei lokasi.',
      basePrice: 0,
      priceModel: PriceModel.QUOTATION,
      durationMinutes: 180,
      sortOrder: 3,
    },

    // AC Service
    {
      categoryId: catMap.get('ac-service'),
      name: 'Isi / Tambah Freon AC (R22 / R32 / R410)',
      slug: 'tambah-freon-ac',
      description: 'Pengisian ulang freon AC sesuai tekanan standar kompresor untuk pendinginan maksimal.',
      basePrice: 150000,
      priceModel: PriceModel.FIXED_PRICE,
      durationMinutes: 45,
      sortOrder: 1,
    },
    {
      categoryId: catMap.get('ac-service'),
      name: 'Bongkar Pasang Unit AC',
      slug: 'bongkar-pasang-ac',
      description: 'Jasa pelepasan unit AC lama dan pemindahan/pemasangan di lokasi baru.',
      basePrice: 300000,
      priceModel: PriceModel.STARTING_FROM,
      durationMinutes: 120,
      sortOrder: 2,
    },

    // Appliance Repair
    {
      categoryId: catMap.get('appliances'),
      name: 'Perbaikan Mesin Cuci 1 & 2 Tabung',
      slug: 'perbaikan-mesin-cuci',
      description: 'Perbaikan mesin cuci mati total, air tidak mengalir, dinamo lemah, atau pengering bising.',
      basePrice: 150000,
      priceModel: PriceModel.STARTING_FROM,
      durationMinutes: 90,
      sortOrder: 1,
    },
    {
      categoryId: catMap.get('appliances'),
      name: 'Perbaikan Kulkas & Freezer',
      slug: 'perbaikan-kulkas',
      description: 'Servis kulkas tidak dingin, ganti kondensor, perbaikan karet pintu, dan isi freon kulkas.',
      basePrice: 180000,
      priceModel: PriceModel.STARTING_FROM,
      durationMinutes: 90,
      sortOrder: 2,
    },

    // Garden & Exterior
    {
      categoryId: catMap.get('garden'),
      name: 'Pemotongan Rumput & Perapihan Halaman',
      slug: 'pemotongan-rumput',
      description: 'Jasa potong rumput menggunakan mesin pemotong potong rumput mengelilingi pekarangan.',
      basePrice: 60000,
      priceModel: PriceModel.HOURLY,
      durationMinutes: 60,
      sortOrder: 1,
    },

    // Pest Control
    {
      categoryId: catMap.get('pest-control'),
      name: 'Layanan Pembasmian Rayap Bangunan',
      slug: 'basmi-rayap',
      description: 'Injeksi tanah dan penyemprotan bahan kimia termitisida bergaransi resmi.',
      basePrice: 0,
      priceModel: PriceModel.QUOTATION,
      durationMinutes: 180,
      sortOrder: 1,
    },

    // Home Improvement
    {
      categoryId: catMap.get('home-improvement'),
      name: 'Jasa Perakitan Furnitur & Lemari',
      slug: 'perakitan-furnitur',
      description: 'Perakitan lemari pakaian, meja kerja, dan rak dinding dari merek toko furnitur ternama.',
      basePrice: 100000,
      priceModel: PriceModel.FIXED_PRICE,
      durationMinutes: 90,
      sortOrder: 1,
    },
    {
      categoryId: catMap.get('home-improvement'),
      name: 'Pengecatan Tembok Interior & Eksterior',
      slug: 'pengecatan-tembok',
      description: 'Pengecatan dinding rumah per meter persegi termasuk pengerokkan cat lama.',
      basePrice: 25000,
      priceModel: PriceModel.STARTING_FROM,
      durationMinutes: 120,
      sortOrder: 2,
    },
  ];

  for (const srv of services) {
    if (!srv.categoryId) continue;
    await prisma.service.upsert({
      where: { slug: srv.slug },
      update: srv,
      create: srv,
    });
  }

  console.log('✅ Catalog Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
