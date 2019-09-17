import { ForgotPasswordResponse } from './../models/response/forgot-password-response';
import { ForgotPasswordRequest } from './../models/request/forgot-password-request';
import { HttpBaseService } from './http-base-service';
import StorageService from '../database/storage-service';
import { AuthenticationRequest } from '../models/request/authentication-request';
import { AuthenticationResponse } from '../models/response/authentication-response';
import { ResponseViewModel } from '../models/response/response-view-model';
import { StorageConstants } from '../helpers/storage-constants';
import { APIConstants } from '../helpers/api-constants';

export class AuthenticationService {
    public static authenticate = async (
        authenticationRequest: AuthenticationRequest,
    ): Promise<ResponseViewModel<AuthenticationResponse>> => {
        const response = await HttpBaseService.post<AuthenticationRequest, AuthenticationResponse>(
            APIConstants.AUTHENTICATION_URL,
            authenticationRequest,
        );
        if (response && response.data) {
            try {
                await StorageService.store(StorageConstants.TOKEN_KEY, response.data.token);
                await StorageService.store(StorageConstants.USER, response.data);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            console.log('Failure');
        }
        return response;
    };

    public static authCheck = async (): Promise<boolean> => {
        try {
            const token = await StorageService.get<string>(StorageConstants.TOKEN_KEY);
            return token ? true : false;
        } catch (error) {
            Promise.reject(error);
        }
        return false;
    };

    public static forgotPassword = async (
        forgotPasswordRequest: ForgotPasswordRequest,
    ): Promise<ResponseViewModel<ForgotPasswordResponse>> => {
        const response = await HttpBaseService.post<ForgotPasswordRequest, ForgotPasswordResponse>(
            APIConstants.FORGOT_PASSWORD_URL,
            forgotPasswordRequest,
        );
        console.log('Forgot Password Response : ', response);
        return response;
    };
}
