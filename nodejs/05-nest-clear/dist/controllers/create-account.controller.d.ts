import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';
declare const createAccountBodySchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;
export declare class CreateAccountController {
    private prisma;
    constructor(prisma: PrismaService);
    handle(body: CreateAccountBodySchema): Promise<void>;
}
export {};
