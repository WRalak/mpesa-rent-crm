import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Create test landlord users
    const testUsers = [
      {
        phone: '254700000001',
        name: 'John Landlord',
        email: 'john@landlord.com',
        role: Role.LANDLORD
      },
      {
        phone: '254700000002',
        name: 'Jane Landlord',
        email: 'jane@landlord.com',
        role: Role.LANDLORD
      },
      {
        phone: '254700000003',
        name: 'Bob Landlord',
        email: 'bob@landlord.com',
        role: Role.LANDLORD
      },
      {
        phone: '254700000004',
        name: 'Alice Landlord',
        email: 'alice@landlord.com',
        role: Role.LANDLORD
      },
      {
        phone: '254700000005',
        name: 'Test Landlord',
        email: 'test@landlord.com',
        role: Role.LANDLORD
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await prisma.user.findFirst({
        where: { phone: userData.phone }
      });

      if (!existingUser) {
        const user = await prisma.user.create({
          data: userData
        });
        console.log(`Created user: ${userData.name} (${userData.phone})`);
      } else {
        console.log(`User already exists: ${userData.phone}`);
      }
    }

    console.log('\nTest users created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: 254700000000');
    console.log('Landlord 1: 254700000001 (John)');
    console.log('Landlord 2: 254700000002 (Jane)');
    console.log('Landlord 3: 254700000003 (Bob)');
    console.log('Landlord 4: 254700000004 (Alice)');
    console.log('Landlord 5: 254700000005 (Test)');
    
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
