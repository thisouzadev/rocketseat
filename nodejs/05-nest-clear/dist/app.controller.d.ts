import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private prisma;
    constructor(prisma: PrismaService);
    store(): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
    }[]>;
}
