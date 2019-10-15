import { BoardResponse } from './../models/response/board-response';
import { StateResponse } from './../models/response/state-response';
import { HttpBaseService } from './http-base-service';
import { ResponseViewModel } from '../models/response/response-view-model';
import { LeadResponse, OTPResponse } from '../models/response';
import { PaginatedResponseModel } from '../models/response/paginated-response-model';
import { LeadRequest } from '../models/request/lead-request';
import { APIConstants } from '../helpers/api-constants';
import { OTPRequest } from '../models/request';
import { LeadReport } from '../models/response/lead-report-model';
import { SyncLeadRequest } from '../models/request/sync-leads-request';
import { StatusResponse } from '../models/response/status-response';
import { LeadFilterResponse } from '../models/response/lead-filter-response';
export class LeadService {
    //Paginated method
    public static fetchLeads = async (
        pgNo: number,
        isOtpVerified: boolean,
    ): Promise<ResponseViewModel<PaginatedResponseModel<LeadResponse>>> => {
        const response = await HttpBaseService.get<LeadResponse>(
            APIConstants.USER_LEADS_URL + '?page=' + pgNo + '&otp_verified=' + isOtpVerified,
        );
        console.log('api url', APIConstants.USER_LEADS_URL + '?page=' + pgNo + '&otp_verified=' + isOtpVerified);
        console.log('res', response);
        return response;
    };

    public static fetchFilteredLeads = async (
        pgNo: number,
        flag: string,
        isOtpVerified: boolean,
    ): Promise<ResponseViewModel<PaginatedResponseModel<LeadFilterResponse>>> => {
        const response = await HttpBaseService.get<LeadFilterResponse>(
            APIConstants.USER_LEADS_URL + '?page=' + pgNo + '&flag=' + flag + '&otp_verified=' + isOtpVerified,
        );
        return response;
    };

    public static createLead = async (leadRequest: LeadRequest): Promise<ResponseViewModel<LeadResponse>> => {
        const response = await HttpBaseService.post<LeadRequest, LeadResponse>(
            APIConstants.CREATE_LEAD_URL,
            leadRequest,
        );
        return response;
    };

    public static sendOTP = async (otpRequest: OTPRequest): Promise<ResponseViewModel<OTPResponse>> => {
        console.log('request in service', otpRequest);
        const response = await HttpBaseService.post<OTPRequest, OTPResponse>(APIConstants.SEND_OTP_URL, otpRequest);
        return response;
    };

    public static fetchBoards = async (): Promise<ResponseViewModel<BoardResponse>> => {
        const response = await HttpBaseService._get<BoardResponse>(APIConstants.BOARDS_URL);
        return response;
    };

    public static fetchClasses = async (): Promise<ResponseViewModel<BoardResponse>> => {
        const response = await HttpBaseService._get<BoardResponse>(APIConstants.CLASSES_URL);
        return response;
    };

    public static fetchStateByCountry = async (countryId: number): Promise<ResponseViewModel<StateResponse>> => {
        const response = await HttpBaseService._get<StateResponse>(`/meta/country/${countryId}/states`);
        return response;
    };

    public static fetchLeadReport = async (): Promise<ResponseViewModel<LeadReport>> => {
        const response = await HttpBaseService._get<LeadReport>(APIConstants.LEAD_REPORT_URL);
        return response;
    };

    public static syncLeads = async (leads: SyncLeadRequest): Promise<ResponseViewModel<StatusResponse>> => {
        let response = await HttpBaseService.post<SyncLeadRequest, StatusResponse>(
            APIConstants.LEAD_OFFLINE_SYNC,
            leads,
        );
        return response;
    };

    public static verifyLead = async (leadId: string): Promise<ResponseViewModel<LeadResponse>> => {
        const response = await HttpBaseService.post<{}, LeadResponse>(`/lead/${leadId}/verify`, {});
        return response;
    };
}
