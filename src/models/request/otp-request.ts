export class OTPRequest {
    public phone: string;
    public otp: string;

    constructor(phone: string, otp: string) {
        this.phone = phone;
        this.otp = otp;
    }
}
