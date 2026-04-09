import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.phone);
      return;
    }

    // Create admin user
    const adminPhone = '254700000000'; // Change this to your desired admin phone
    const adminName = 'System Administrator';
    const adminEmail = 'admin@mpesarentcrm.com';

    const admin = await prisma.user.create({
      data: {
        phone: adminPhone,
        name: adminName,
        email: adminEmail,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created successfully!');
    console.log('Phone:', adminPhone);
    console.log('Email:', adminEmail);
    console.log('Role:', admin.role);
    
    console.log('\nYou can now log in with phone number:', adminPhone);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
