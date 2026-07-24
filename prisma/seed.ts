import { PrismaClient, PriceModel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Home Services Marketplace Catalog Seeding...');

  // 1. Service Categories
  const categories = [
    {
      name: 'Perawatan Anak & Bayi',
      slug: 'childcare',
      description: 'Layanan baby sitter harian, pendamping belajar anak (nanny), dan perawatan bayi baru lahir oleh perawat terverifikasi.',
      icon: 'Baby',
      sortOrder: 1,
    },
    {
      name: 'Perawatan Lansia & Home Care',
      slug: 'elderly-care',
      description: 'Pendampingan lansia harian, perawat medis rumah (home care nurse), dan asisten kesehatan keluarga.',
      icon: 'HeartHandshake',
      sortOrder: 2,
    },
    {
      name: 'Pembersihan Rumah',
      slug: 'cleaning',
      description: 'Layanan pembersihan rumah harian, deep cleaning, cuci sofa, karpet, dan kamar mandi.',
      icon: 'Sparkles',
      sortOrder: 3,
    },
    {
      name: 'Perbaikan Pipa & Ledeng',
      slug: 'plumbing',
      description: 'Perbaikan keran bocor, saluran mampet, instalasi toilet, wastafel, dan kran air.',
      icon: 'Droplets',
      sortOrder: 4,
    },
    {
      name: 'Kelistrikan & Instalasi',
      slug: 'electrical',
      description: 'Pemasangan stopkontak, sakelar, perbaikan konsleting listrik, dan instalasi lampu.',
      icon: 'Zap',
      sortOrder: 5,
    },
    {
      name: 'Servis AC & Pendingin',
      slug: 'ac-service',
      description: 'Cuci AC rutin, tambah/isi freon, perbaikan AC tidak dingin, dan bongkar pasang unit.',
      icon: 'Wind',
      sortOrder: 6,
    },
    {
      name: 'Perbaikan Elektronik Rumah',
      slug: 'appliances',
      description: 'Servis mesin cuci, kulkas, dispenser air, microwave, dan alat elektronik rumah tangga.',
      icon: 'Wrench',
      sortOrder: 7,
    },
    {
      name: 'Masak & Asisten Dapur',
      slug: 'home-cook',
      description: 'Jasa masak harian rumah tangga, penyiapan meal prep mingguan, dan asisten kuliner acara keluarga.',
      icon: 'Utensils',
      sortOrder: 8,
    },
    {
      name: 'Perawatan Hewan (Pet Care)',
      slug: 'pet-care',
      description: 'Jasa pet grooming anjing/kucing panggilan ke rumah, memandikan, dan dog walking.',
      icon: 'Dog',
      sortOrder: 9,
    },
    {
      name: 'Taman & Eksterior',
      slug: 'garden',
      description: 'Pemotongan rumput, perawatan tanaman, pembersihan halaman, dan pemangkasan pohon.',
      icon: 'Trees',
      sortOrder: 10,
    },
    {
      name: 'Pengendalian Hama (Pest Control)',
      slug: 'pest-control',
      description: 'Pembasmian rayap, kecoak, tikus, nyamuk, dan pengasapan/fogging lingkungan.',
      icon: 'Bug',
      sortOrder: 11,
    },
    {
      name: 'Renovasi & Pertukangan',
      slug: 'home-improvement',
      description: 'Pengecatan dinding, perakitan furnitur, perbaikan pintu/jendela, dan renovasi ringan.',
      icon: 'Paintbrush',
      sortOrder: 12,
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

  // 2. Dynamic Services
  const services = [
    // Perawatan Anak & Bayi
    {
      categoryId: catMap.get('childcare'),
      name: 'Baby Sitter Harian (Full Day 8-12 Jam)',
      slug: 'baby-sitter-harian',
      description: 'Pengasuhan bayi & balita profesional terverifikasi, memandikan, menyuapi, dan menemani aktivitas bermain.',
      basePrice: 180000,
      priceModel: PriceModel.HOURLY,
      durationMinutes: 480,
      sortOrder: 1,
    },
    {
      categoryId: catMap.get('childcare'),
      name: 'Nanny Pendamping Belajar Anak',
      slug: 'nanny-pendamping-belajar',
      description: 'Pendampingan anak usia sekolah dasar dalam mengerjakan PR, kegiatan kreatif, dan stimulasi tumbuh kembang.',
      basePrice: 60000,
      priceModel: PriceModel.HOURLY,
      durationMinutes: 120,
      sortOrder: 2,
    },
    {
      categoryId: catMap.get('childcare'),
      name: 'Baby Massage & Perawatan Bayi Baru Lahir (Newborn)',
      slug: 'baby-massage-newborn',
      description: 'Pijat bayi relaksasi dan perawatan tali pusat bayi baru lahir oleh bidan/perawat tersertifikasi.',
      basePrice: 150000,
      priceModel: PriceModel.FIXED_PRICE,
      durationMinutes: 60,
      sortOrder: 3,
    },

    // Perawatan Lansia
    {
      categoryId: catMap.get('elderly-care'),
      name: 'Pendamping Lansia Harian',
      slug: 'pendamping-lansia-harian',
      description: 'Pendampingan lansia untuk aktivitas harian, mobilitas, minum obat teratur, dan teman berinteraksi.',
      basePrice: 200000,
      priceModel: PriceModel.HOURLY,
      durationMinutes: 480,
      sortOrder: 1,
    },
    {
      categoryId: catMap.get('elderly-care'),
      name: 'Perawat Medis Rumah (Home Care Nurse)',
      slug: 'perawat-home-care-medis',
      description: 'Perawatan medis pasca rawat inap rumah sakit, perawatan luka, pasang selang NGT/kateter oleh perawat STR.',
      basePrice: 250000,
      priceModel: PriceModel.STARTING_FROM,
      durationMinutes: 180,
      sortOrder: 2,
    },

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

    // Masak & Dapur
    {
      categoryId: catMap.get('home-cook'),
      name: 'Jasa Masak Harian Keluarga',
      slug: 'jasa-masak-harian',
      description: 'Koki rumah tangga untuk memasak 3-4 menu masakan keluarga harian sesuai selera & diet.',
      basePrice: 120000,
      priceModel: PriceModel.FIXED_PRICE,
      durationMinutes: 150,
      sortOrder: 1,
    },

    // Pet Care
    {
      categoryId: catMap.get('pet-care'),
      name: 'Home Service Pet Grooming (Anjing/Kucing)',
      slug: 'pet-grooming-home-service',
      description: 'Mandi sehat, potong kuku, pembersihan telinga, dan pengeringan bulu anjing/kucing langsung di rumah Anda.',
      basePrice: 110000,
      priceModel: PriceModel.STARTING_FROM,
      durationMinutes: 90,
      sortOrder: 1,
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
  ];

  for (const srv of services) {
    if (!srv.categoryId) continue;
    await prisma.service.upsert({
      where: { slug: srv.slug },
      update: srv,
      create: srv,
    });
  }

  console.log('✅ Catalog Seeding Completed Successfully with Childcare & Household categories!');
}

main()
  .catch((e) => {
    console.error('Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
