import { HttpBaseService } from './http-base-service';
import StorageService from '../database/storage-service';
import { AuthenticationRequest } from '../models/request/authentication-request';
import { AuthenticationResponse } from '../models/response/authentication-response';
import { ResponseViewModel } from '../models/response/response-view-model';

export class AuthenticationService {
    public static loginApi = async (authenticationRequest: AuthenticationRequest) => {
        const body = JSON.stringify({ authenticationRequest });
        try {
            const response = await HttpBaseService.post(`/authenticate`, body);
            console.log('Auth Response : ', response);
            if (response !== null) {
                try {
                    // await StorageService.store('user', response.data.data);
                } catch (error) {
                    console.log('Error in storing asyncstorage', error);
                }
            } else {
                console.log('Failure');
            }
        } catch (error) {
            console.log(error);
        }
    };
}
