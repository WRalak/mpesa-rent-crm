import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPhone = "254700000001";

  await prisma.user.upsert({
    where: { phone: adminPhone },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@mpesarentcrm.local",
      phone: adminPhone,
      role: "ADMIN",
    },
  });

  const landlord = await prisma.user.upsert({
    where: { phone: "254700000002" },
    update: {},
    create: {
      name: "Demo Landlord",
      email: "landlord@mpesarentcrm.local",
      phone: "254700000002",
      role: "LANDLORD",
    },
  });

  const property = await prisma.property.upsert({
    where: { id: "seed-property-1" },
    update: {},
    create: {
      id: "seed-property-1",
      name: "Ruaka Heights",
      location: "Ruaka",
      unitCount: 5,
      landlordId: landlord.id,
    },
  });

  const tenant = await prisma.tenant.upsert({
    where: { id: "seed-tenant-1" },
    update: {},
    create: {
      id: "seed-tenant-1",
      fullName: "Jane Wanjiku",
      phone: "254711111111",
      unitNumber: "A1",
      rentAmount: 15000,
      propertyId: property.id,
      landlordId: landlord.id,
    },
  });

  // Payment creation commented out due to TypeScript error
  // await prisma.payment.create({
  //   data: {
  //     amount: 15000,
  //     phoneNumber: tenant.phone,
  //     status: "SUCCESS",
  //     paidAt: new Date(),
  //     mpesaReceipt: `SEED${Date.now()}`,
  //     tenantId: tenant.id,
  //     landlordId: landlord.id,
  //     propertyId: property.id,
  //   },
  // });

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
