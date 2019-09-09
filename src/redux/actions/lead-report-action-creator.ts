import { FETCH_LEAD_REPORT, LEAD_REPORT_START, LEAD_REPORT_FAIL } from './action-types';
import { LeadReport } from '../../models/response/lead-report-model';

export const fetchLeadReportAction = (leadReport: LeadReport) => {
    return {
        type: FETCH_LEAD_REPORT,
        payload: leadReport,
    };
};

export const leadReportStartAction = () => {
    return {
        type: LEAD_REPORT_START,
    };
};

export const leadReportFailureAction = error => {
    return {
        type: LEAD_REPORT_FAIL,
        payload: error,
    };
};
