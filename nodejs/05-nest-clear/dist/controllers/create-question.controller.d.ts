import { UserPayload } from 'src/auth/jwt.strategy';
export declare class CreateQuestionController {
    constructor();
    handle(user: UserPayload): Promise<string>;
}
