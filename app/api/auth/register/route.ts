import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { hashPassword } from '../../../../lib/auth/session';
import { signJWT, setSessionCookie } from '../../../../lib/auth/jwt';
import { Role } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role = Role.CUSTOMER, bio, yearsExperience } = body;

    // Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const targetRole = role === Role.PROVIDER ? Role.PROVIDER : Role.CUSTOMER;

    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
    }

    // Password hashing
    const passwordHash = await hashPassword(password);

    // Create user and profile in Prisma transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          passwordHash,
          phone: phone ? phone.trim() : null,
          role: targetRole,
        },
      });

      if (targetRole === Role.CUSTOMER) {
        await tx.customerProfile.create({
          data: {
            userId: user.id,
          },
        });
      } else if (targetRole === Role.PROVIDER) {
        await tx.providerProfile.create({
          data: {
            userId: user.id,
            bio: bio || null,
            yearsExperience: Number(yearsExperience) || 1,
            verificationStatus: 'PENDING',
          },
        });
      }

      return user;
    });

    // Create JWT Session
    const sessionPayload = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    const token = await signJWT(sessionPayload);

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

    return setSessionCookie(response, token);
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error during registration' }, { status: 500 });
  }
}
