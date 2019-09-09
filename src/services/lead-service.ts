import { BoardResponse } from './../models/response/board-response';
import { StateResponse } from './../models/response/state-response';
import { HttpBaseService } from './http-base-service';
import StorageService from '../database/storage-service';
import { ResponseViewModel } from '../models/response/response-view-model';
import { StorageConstants } from '../helpers/storage-constants';
import { LeadResponse, OTPResponse } from '../models/response';
import { PaginatedResponseModel } from '../models/response/paginated-response-model';
import { LeadRequest } from '../models/request/lead-request';
import { APIConstants } from '../helpers/api-constants';
import { OTPRequest } from '../models/request';

import axios from 'axios';

export class LeadService {
    //Paginated method
    public static fetchLeads = async (
        pgNo: number,
    ): Promise<ResponseViewModel<PaginatedResponseModel<LeadResponse>>> => {
        const response = await HttpBaseService.get<LeadResponse>(APIConstants.USER_LEADS_URL + pgNo);
        if (response && response.data) {
            try {
                console.log(response.data);
                // await StorageService.store(StorageConstants.USER_LEADS, response.data.data);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            console.log('Failure');
        }
        return response;
    };

    public static createLead = async (leadRequest: LeadRequest): Promise<ResponseViewModel<LeadResponse>> => {
        const response = await HttpBaseService.post<LeadRequest, LeadResponse>(
            APIConstants.CREATE_LEAD_URL,
            leadRequest,
        );
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
        const response = await HttpBaseService.post<OTPRequest, OTPResponse>(APIConstants.VERIFY_OTP_URL, otpRequest);
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

    public static fetchBoards = async (): Promise<ResponseViewModel<BoardResponse>> => {
        const response = await HttpBaseService._get<BoardResponse>(APIConstants.BOARDS_URL);
        if (response && response.data) {
            try {
                console.log('response in service', response.data);
                return response.data;
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            console.log('Failure');
        }
        return response;
    };

    public static fetchClasses = async (): Promise<ResponseViewModel<BoardResponse>> => {
        const response = await HttpBaseService._get<BoardResponse>(APIConstants.CLASSES_URL);
        if (response && response.data) {
            try {
                console.log('response in service', response.data);
                return response.data;
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            console.log('Failure');
        }
        return response;
    };

    public static fetchStateByCountry = async (countryId: number): Promise<ResponseViewModel<StateResponse>> => {
        const response = await HttpBaseService._get<StateResponse>(`/meta/country/${countryId}/states`);
        //const response = await axios.get<ResponseViewModel<StateResponse>>(`localhost:8080/meta/country/${countryId}/states`);
        console.log('response fetchStateByCountry', response);
        if (response && response.data) {
            try {
                console.log('response in service', response.data);
                return response.data;
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            console.log('Failure');
        }
        return response;
    };
}
