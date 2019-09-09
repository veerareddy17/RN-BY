import { Dispatch } from 'redux';
import { LeadService } from '../../services/lead-service';
import { fetchLeadReportAction, leadReportStartAction, leadReportFailureAction } from './lead-report-action-creator';

export const fetchLeadReport = (): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    return async (dispatch: Dispatch, getState) => {
        let isConnected = getState().connectionStateReducer.isConnected;
        if (!isConnected) {
            let response = getState().leadReportReducer.leadReport;
            dispatch(fetchLeadReportAction(response));
            return;
        }
        dispatch(leadReportStartAction());
        const response = await LeadService.fetchLeadReport();
        if (response && response.data) {
            dispatch(fetchLeadReportAction(response.data));
        } else {
            dispatch(leadReportFailureAction(response.errors));
        }
    };
};
