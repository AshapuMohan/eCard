import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    if (process.env.NODE_ENV === 'production') {
        console.log("Initializing Prisma Client in production...");
        if (!process.env.DATABASE_URL) {
            console.error("CRITICAL ERROR: DATABASE_URL is undefined in production environment!");
        } else {
            console.log("DATABASE_URL is defined. Length:", process.env.DATABASE_URL.length);
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
