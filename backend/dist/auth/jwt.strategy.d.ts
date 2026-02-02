import { Strategy } from 'passport-jwt';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interfaces';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithoutRequest] | [opt: import("passport-jwt").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: ActiveUserInterface): Promise<{
        id: number;
        dni: string;
        role: string;
    }>;
}
export {};
