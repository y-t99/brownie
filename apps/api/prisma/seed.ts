import { PrismaClient } from "@prisma/client";

const DEFAULT_QUOTA_BALANCE = 100;

async function main() {
  const prisma = new PrismaClient();

  const users = await prisma.user.findMany({
    where: { deleted: false },
    select: { uuid: true },
  });

  for (const user of users) {
    await prisma.subscriptionQuota.upsert({
      where: { created_by: user.uuid },
      update: {
        updated_by: user.uuid,
      },
      create: {
        balance: DEFAULT_QUOTA_BALANCE,
        locked_balance: 0,
        total_spent: 0,
        warning_threshold: 0,
        created_by: user.uuid,
        updated_by: user.uuid,
      },
    });
  }

  await prisma.$disconnect();
}

main().catch(async (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
