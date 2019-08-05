import storage from '../database/storage';
import config from './config';

export default async function generateOTP() {
    try {
        let digits = config.otp.digits;
        let otp = '';

        for (let i = 1; i <= config.otp.length; i++) {
            let index = Math.floor(Math.random() * digits.length);

            otp = otp + digits[index];
        }

        await storage.storeData('OTP', otp);

        return otp;
    } catch (error) {
        console.log('Something went wrong', error);
    }
}
