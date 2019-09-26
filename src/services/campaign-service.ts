import { BatchOfAttendance } from './../models/request/batch-attendance-request';
import { AttendanceResponse } from './../models/response/attendance-response';
import { Attendance } from './../models/request/attendance-request';
import { HttpBaseService } from './http-base-service';
import { ResponseViewModel } from '../models/response/response-view-model';
import { CampaignResponse } from '../models/response/campaign-response';
import { APIConstants } from '../helpers/api-constants';

export class CampaignService {
    public static fetchCampaigns = async (): Promise<ResponseViewModel<CampaignResponse>> => {
        const response = await HttpBaseService._get<CampaignResponse>(APIConstants.CAMPAIGNS_URL);
        return response;
    };

    public static attendance = async (attendance: Attendance): Promise<ResponseViewModel<AttendanceResponse>> => {
        const response = await HttpBaseService.post<Attendance, AttendanceResponse>(
            APIConstants.ATTENDANCE,
            attendance,
        );
        return response;
    };

    public static attendance_offlineSync = async (attendances: BatchOfAttendance): Promise<ResponseViewModel<AttendanceResponse>> => {

        console.log('batch service request', attendances)
        const response = await HttpBaseService.post<BatchOfAttendance, AttendanceResponse>(
            APIConstants.ATTENDANCE_OFFLINE_SYNC,
            attendances,
        );
        return response;
    };
}
