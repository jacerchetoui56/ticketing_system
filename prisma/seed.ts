import { PrismaClient, Roles } from "@prisma/client";
const prisma = new PrismaClient();
import * as bcryptjs from "bcrypt";

async function main() {
  const adminPassword = "superadminpass";

  const hashedPassword = await bcryptjs.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: "superadmin@gmail.com" },
    update: {},
    create: {
      name: "super admin",
      email: "superadmin@gmail.com",
      role: Roles.superadmin,
      password: hashedPassword,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
