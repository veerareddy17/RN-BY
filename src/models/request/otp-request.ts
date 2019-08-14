export class OTPRequest {
    public phone: string;
    public code: string;

    constructor(phone: string, code: string) {
        this.phone = phone;
        this.code = code;
    }
}
