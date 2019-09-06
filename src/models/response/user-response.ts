import { MetaResponse } from './meta-response';

export class UserResponse {
    public id: string;
    public email: string;
    public name: string;
    public role: string;
    public phone: string;
    public offline_pin: string;
    public active: boolean;
    public city_id: number;
    public city: MetaResponse;
}
