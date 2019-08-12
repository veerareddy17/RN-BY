import { HttpBaseService } from './http-base-service';
import StorageService from '../database/storage-service';
import { ResponseViewModel } from '../models/response/response-view-model';
import { StorageConstants } from '../helpers/storage-constants';
import { LeadResponse, OTPResponse } from '../models/response';
import { PaginatedResponseModel } from '../models/response/paginated-response-model';
import { LeadRequest } from '../models/request/lead-request';
import { APIConstants } from '../helpers/api-constants';
import { OTPRequest } from '../models/request';

export class LeadService {
    //Non Paginated method
    public static _fetchLeads = async (): Promise<ResponseViewModel<LeadResponse>> => {
        const response = await HttpBaseService._get<LeadResponse>(`/user/leads`);
        console.log('Leads Response : ', response);
        if (response && response.data) {
            try {
                // await StorageService.store(StorageConstants.USER_LEADS, response.data);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            console.log('Failure');
        }
        return response;
    };

    //Paginated method
    public static fetchLeads = async (
        pgNo: number,
    ): Promise<ResponseViewModel<PaginatedResponseModel<LeadResponse>>> => {
        const response = await HttpBaseService.get<LeadResponse>(APIConstants.USER_LEADS_URL + `${pgNo}`);
        console.log('Leads Response : ', response);
        if (response && response.data) {
            try {
                await StorageService.store(StorageConstants.USER_LEADS, response.data.data);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            console.log('Failure');
        }
        return response;
    };

    public static createLead = async (leadRequest: any): Promise<ResponseViewModel<LeadResponse>> => {
        const response = await HttpBaseService.post<any, LeadResponse>(`/lead`, leadRequest);
        console.log('Leads Response : ', response);
        if (response && response.data) {
            try {
                // await StorageService.store(StorageConstants.USER_LEADS, response.data);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            console.log('Failure');
        }
        return response;
    };

    public static verifyOTP = async (otpRequest: OTPRequest): Promise<ResponseViewModel<OTPResponse>> => {
        const response = await HttpBaseService.post<any, OTPResponse>(APIConstants.VERIFY_OTP_URL, otpRequest);
        console.log('OTP Response : ', response);
        if (response && response.data) {
            try {
                return response;
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            console.log('Failure');
        }
        return response;
    };
}
