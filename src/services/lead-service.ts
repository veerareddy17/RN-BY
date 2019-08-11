import { HttpBaseService } from './http-base-service';
import StorageService from '../database/storage-service';
import { ResponseViewModel } from '../models/response/response-view-model';
import { StorageConstants } from '../helpers/storage-constants';
import { LeadResponse } from '../models/response';
import { PaginatedResponseModel } from '../models/response/paginated-response-model';
import { LeadRequest } from '../models/request/lead-request';

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
        userId: string,
        pgNo: number,
    ): Promise<ResponseViewModel<PaginatedResponseModel<LeadResponse>>> => {
        const response = await HttpBaseService.get<LeadResponse>(`/user/${userId}/leads?page=${pgNo}`);
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
}
