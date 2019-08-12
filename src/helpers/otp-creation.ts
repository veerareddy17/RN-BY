import config from './config';
import StorageService from '../database/storage-service';
import { StorageConstants } from './storage-constants';

export default async function generateOTP() {
    try {
        let digits = config.otp.digits;
        let otp = '';

        for (let i = 1; i <= config.otp.length; i++) {
            let index = Math.floor(Math.random() * digits.length);

            otp = otp + digits[index];
        }

        await StorageService.store(StorageConstants.USER_OTP, otp);

        return JSON.stringify(otp);
    } catch (error) {
        console.log('Something went wrong', error);
    }
}
