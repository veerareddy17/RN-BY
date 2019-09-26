import { BatchOfAttendance } from './../../models/request/batch-attendance-request';
import { Attendance } from './../../models/request/attendance-request';
import { MetaResponse } from '../../models/response/meta-response';

export const initialState = {
    campaignList: [],
    status: '',
    isLoading: false,
    selectedCampaign: '',
    onlineSelection: Attendance,
    attendance: Array<Attendance>(),
    sync_fail: Array<BatchOfAttendance>(),
};
