import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Direct import since lib/auth/session uses bcryptjs

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@homefix.com';
  const password = 'adminpassword123';
  
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin user already exists!');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
