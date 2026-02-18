import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    if (process.env.NODE_ENV === 'production') {
        console.log("Initializing Prisma Client in production...");
        if (!process.env.POSTGRES_PRISMA_URL) {
            console.error("CRITICAL ERROR: POSTGRES_PRISMA_URL is undefined in production environment!");
        } else {
            console.log("POSTGRES_PRISMA_URL is defined. Length:", process.env.POSTGRES_PRISMA_URL.length);
        }
    }
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
