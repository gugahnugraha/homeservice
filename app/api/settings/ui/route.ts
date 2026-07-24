import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import siteConfig from '../../../../lib/config/site';

export async function GET() {
  try {
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
    return NextResponse.json({
      success: false,
      settings: {
        brandName: siteConfig.name,
        brandTagline: siteConfig.tagline,
        primaryColorTheme: 'ocean',
        defaultCity: siteConfig.defaultCity,
        borderRadius: 'rounded-2xl',
        glassmorphismIntensity: 'high',
      }
    });
  }
}
