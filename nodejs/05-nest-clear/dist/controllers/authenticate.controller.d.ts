import { JwtService } from '@nestjs/jwt';
export declare class AuthenticateController {
    private jwt;
    constructor(jwt: JwtService);
    handle(): Promise<string>;
}
