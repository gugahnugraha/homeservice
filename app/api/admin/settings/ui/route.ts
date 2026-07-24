import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getSessionTokenFromRequest, verifyJWT } from '../../../../../lib/auth/jwt';
import { Role } from '@prisma/client';
import siteConfig from '../../../../../lib/config/site';

export async function GET(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const settings = await prisma.platformSetting.findMany({
      where: {
        key: {
          in: [
            'brand_name',
            'brand_tagline',
            'primary_color_theme',
            'default_city',
            'border_radius',
            'glassmorphism_intensity'
          ]
        }
      }
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({
      success: true,
      settings: {
        brandName: settingsMap['brand_name'] || siteConfig.name,
        brandTagline: settingsMap['brand_tagline'] || siteConfig.tagline,
        primaryColorTheme: settingsMap['primary_color_theme'] || 'ocean',
        defaultCity: settingsMap['default_city'] || siteConfig.defaultCity,
        borderRadius: settingsMap['border_radius'] || 'rounded-2xl',
        glassmorphismIntensity: settingsMap['glassmorphism_intensity'] || 'high',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch UI settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await verifyJWT(token);
    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { brandName, brandTagline, primaryColorTheme, defaultCity, borderRadius, glassmorphismIntensity } = body;

    const upsertPromises = [];

    if (brandName) {
      upsertPromises.push(
        prisma.platformSetting.upsert({
          where: { key: 'brand_name' },
          update: { value: brandName },
          create: { key: 'brand_name', value: brandName, description: 'Nama Brand Platform' }
        })
      );
    }

    if (brandTagline) {
      upsertPromises.push(
        prisma.platformSetting.upsert({
          where: { key: 'brand_tagline' },
          update: { value: brandTagline },
          create: { key: 'brand_tagline', value: brandTagline, description: 'Tagline Utama Platform' }
        })
      );
    }

    if (primaryColorTheme) {
      upsertPromises.push(
        prisma.platformSetting.upsert({
          where: { key: 'primary_color_theme' },
          update: { value: primaryColorTheme },
          create: { key: 'primary_color_theme', value: primaryColorTheme, description: 'Tema Warna Utama UI' }
        })
      );
    }

    if (defaultCity) {
      upsertPromises.push(
        prisma.platformSetting.upsert({
          where: { key: 'default_city' },
          update: { value: defaultCity },
          create: { key: 'default_city', value: defaultCity, description: 'Kota Default Layanan' }
        })
      );
    }

    if (borderRadius) {
      upsertPromises.push(
        prisma.platformSetting.upsert({
          where: { key: 'border_radius' },
          update: { value: borderRadius },
          create: { key: 'border_radius', value: borderRadius, description: 'Gaya Kelengkungan Sudut Card UI' }
        })
      );
    }

    if (glassmorphismIntensity) {
      upsertPromises.push(
        prisma.platformSetting.upsert({
          where: { key: 'glassmorphism_intensity' },
          update: { value: glassmorphismIntensity },
          create: { key: 'glassmorphism_intensity', value: glassmorphismIntensity, description: 'Intensitas Efek Kaca Glassmorphism' }
        })
      );
    }

    await Promise.all(upsertPromises);

    return NextResponse.json({
      success: true,
      message: 'Pengaturan tema warna dan UI platform berhasil disimpan!',
    });
  } catch (error) {
    console.error('Update UI Settings Error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui pengaturan UI' }, { status: 500 });
  }
}
